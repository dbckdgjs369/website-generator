import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { useEffect, useRef, useState } from "react";
// import { allHtmlTags } from "../../constant/constant";

export default function ToolBar() {
  const [tagList] = useState<string[]>(["div", "button"]);
  const [elementStyle, setElementStyle] = useState<string>("");
  const [elementText, setElementText] = useState("");
  const globalEmitter = useGlobalEventEmitter();
  const styleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("click", ev.currentTarget.id);
  };

  const addStyle = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("style", styleTextareaRef.current?.value);
  };

  const addText = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("text", textTextareaRef.current?.value);
  };

  const handleButtonClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const { id } = ev.currentTarget;
    switch (id) {
      case "delete": {
        globalEmitter.emit(id, id);
        break;
      }
      case "style": {
        globalEmitter.emit(id, styleTextareaRef.current?.value);
        break;
      }
      case "text": {
        globalEmitter.emit(id, textTextareaRef.current?.value);
        break;
      }
      case "save":
      case "clear":
      case "load": {
        globalEmitter.emit("file", id);
        break;
      }
    }
  };

  const handleStyle = (style: string) => {
    if (!style) return;
    const trimmedString = style.slice(1, -1);

    // 큰따옴표 없애기
    const withoutQuotes = trimmedString.replace(/"/g, "");
    if (!withoutQuotes) return;
    // 쉼표를 세미콜론으로 바꾸기
    const cssProperties = withoutQuotes.replace(/,/g, ";\n") + ";";

    setElementStyle(cssProperties);
  };
  const handleText = (content: string) => {
    setElementText(content?.replace(/"/g, ""));
  };

  useEffect(() => {
    globalEmitter.on("element_style", handleStyle);
    globalEmitter.on("element_text", handleText);
    return () => {
      globalEmitter.off("element_style", handleStyle);
      globalEmitter.off("element_text", handleText);
    };
  }, []);

  return (
    <S.ToolBarWrapper>
      <S.CurrentWrapper>
        <textarea
          placeholder="추가하실 스타일을 입력하세요"
          style={{ height: "200px" }}
          ref={styleTextareaRef}
          value={elementStyle}
          onChange={(ev) => setElementStyle(ev.target.value)}
        />
        <button onClick={addStyle}>직접 스타일 추가</button>
        <textarea
          placeholder="추가하실 문구를 입력하세요"
          style={{ height: "200px" }}
          ref={textTextareaRef}
          value={elementText}
          onChange={(ev) => setElementText(ev.target.value)}
        />
        <button onClick={addText}>문구 추가</button>
      </S.CurrentWrapper>
      <S.CurrentWrapper>
        {tagList.map((tag) => (
          <button onClick={(ev) => handleButton(ev)} id={tag} key={tag}>
            {tag}
          </button>
        ))}
      </S.CurrentWrapper>
      <button onClick={handleButtonClick} id="delete">
        delete
      </button>
      <S.ButtonWrapper>
        <S.Button onClick={handleButtonClick} id="save">
          save
        </S.Button>
        <S.Button onClick={handleButtonClick} id="clear">
          clear
        </S.Button>
        <S.Button onClick={handleButtonClick} id="load">
          load
        </S.Button>
      </S.ButtonWrapper>
    </S.ToolBarWrapper>
  );
}
