/* eslint-disable @typescript-eslint/no-explicit-any */
import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { useEffect, useRef, useState } from "react";

export default function ToolBar() {
  const [elementStyle, setElementStyle] = useState<any>("");
  const globalEmitter = useGlobalEventEmitter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("click", ev.currentTarget.id);
  };
  const handleDelete = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("delete", ev.currentTarget.id);
  };

  const addStyle = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("style", textareaRef.current?.value);
  };
  const handleFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("file", ev.currentTarget?.id);
  };

  const handleStyle = (style: any) => {
    console.log(":::::style in toolbar", style);
    if (!style) return;
    const trimmedString = style.slice(1, -1);

    // 큰따옴표 없애기
    const withoutQuotes = trimmedString.replace(/"/g, "");

    // 쉼표를 세미콜론으로 바꾸기
    const cssProperties = withoutQuotes.replace(/,/g, ";\n") + ";";

    setElementStyle(cssProperties);
  };

  useEffect(() => {
    globalEmitter.on("client_style", handleStyle);

    return () => {
      globalEmitter.off("client_style", handleStyle);
    };
  }, []);

  return (
    <S.ToolBarWrapper>
      <S.CurrentWrapper>여기에 클릭한 요소가 보여야 됌</S.CurrentWrapper>
      <S.ButtonWrapper>
        <S.Button>left</S.Button>
        <S.Button>center</S.Button>
        <S.Button>right</S.Button>
      </S.ButtonWrapper>
      <S.CurrentWrapper>
        <textarea
          style={{ height: "200px" }}
          ref={textareaRef}
          value={elementStyle}
          onChange={(ev) => setElementStyle(ev.target.value)}
        />
        <button onClick={addStyle}>직접 스타일 추가</button>
      </S.CurrentWrapper>
      <button onClick={(ev) => handleButton(ev)} id="div">
        div
      </button>
      <button onClick={handleButton} id="button">
        button
      </button>
      <button onClick={handleDelete} id="delete">
        delete
      </button>
      <button onClick={handleFile} id="save">
        save
      </button>
      <button onClick={handleFile} id="clear">
        clear
      </button>
      <button onClick={handleFile} id="load">
        load
      </button>
    </S.ToolBarWrapper>
  );
}
