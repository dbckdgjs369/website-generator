import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import usePageData from "../../hooks/usePageData";

// import { allHtmlTags } from "../../constant/constant";

export default function ToolBar() {
  // const [currentDirection, setCurrentDirection] = useState("row");
  const [tagList] = useState<string[]>(["div", "button"]);
  const [elementStyle, setElementStyle] = useState<string>("");
  const [elementText, setElementText] = useState("");
  const [componentName, setComponentName] = useState("");
  const globalEmitter = useGlobalEventEmitter();
  const styleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pageList } = usePageData("");
  const location = useLocation();

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
    globalEmitter.emit("text", textInputRef.current?.value);
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
        globalEmitter.emit(id, textInputRef.current?.value);
        break;
      }
      case "save":
      case "clear":
      case "load":
      case "component": {
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
  const [, setComponentList] = useState([]);
  const loadData = localStorage.getItem("component");
  useEffect(() => {
    if (loadData) {
      const data = JSON.parse(loadData);
      setComponentList(data);
    }
  }, [loadData]);

  const handelAlign = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = ev.currentTarget;
    let alignStyle = "";
    if (id.includes("left")) {
      alignStyle += "justify-content:start;";
    }
    if (id.includes("center")) {
      alignStyle += "justify-content:center;";
    }
    if (id.includes("right")) {
      alignStyle += "justify-content: end;";
    }
    if (id.includes("top")) {
      alignStyle += "align-items: start;";
    }
    if (id.includes("middle")) {
      alignStyle += "align-items:center;";
    }
    if (id.includes("bottom")) {
      alignStyle += "align-items:end;";
    }

    switch (id) {
      case "row": {
        alignStyle += "flex-direction: row;";
        break;
      }
      case "column": {
        alignStyle += "flex-direction: column;";
        break;
      }
    }
    globalEmitter.emit("style", styleTextareaRef.current?.value + alignStyle);
  };
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
        <div>
          <button id="row" onClick={handelAlign}>
            row
          </button>
          <button id="column" onClick={handelAlign}>
            column
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
          }}
        >
          <button id="top_left" onClick={handelAlign}>
            top left
          </button>
          <button id="top_center" onClick={handelAlign}>
            top center
          </button>
          <button id="top_right" onClick={handelAlign}>
            top right
          </button>
          <button id="middle_left" onClick={handelAlign}>
            middle left
          </button>
          <button id="middle_center" onClick={handelAlign}>
            middle center
          </button>
          <button id="middle_right" onClick={handelAlign}>
            middle right
          </button>
          <button id="bottom_left" onClick={handelAlign}>
            bottom left
          </button>
          <button id="bottom_center" onClick={handelAlign}>
            bottom center
          </button>
          <button id="bottom_right" onClick={handelAlign}>
            bottom right
          </button>
        </div>
        <button onClick={addStyle}>직접 스타일 추가</button>
        <input
          placeholder="추가하실 문구를 입력하세요"
          ref={textInputRef}
          value={elementText}
          onChange={(ev) => setElementText(ev.target.value)}
        />
        <button onClick={addText}>문구 추가</button>
      </S.CurrentWrapper>
      <S.CurrentWrapper>
        {[...tagList, ...Object.keys(pageList)].map((tag) => (
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
      <div>
        <input onChange={(ev) => setComponentName(ev.target.value)} />
        <S.Button
          onClick={() => {
            navigate(`/component/${componentName}`);
          }}
        >
          make component
        </S.Button>
      </div>
      <select onChange={(ev) => console.log(ev.target.value)}>
        {Object.keys(pageList).map((component) => (
          <option>{component}</option>
        ))}
      </select>
      <S.Button onClick={() => navigate("/main")}>return to main</S.Button>
      <S.Button onClick={() => navigate("/")}>see result</S.Button>
      {location.pathname.includes("component") ? (
        <S.Button id="component" onClick={handleButtonClick}>
          저장하기
        </S.Button>
      ) : null}
      {/* <select>{componentList.map(e=>e.)}</select> */}
    </S.ToolBarWrapper>
  );
}
