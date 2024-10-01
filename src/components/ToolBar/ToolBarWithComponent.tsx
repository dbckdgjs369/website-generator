import { useNavigate } from "react-router-dom";

import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { Column } from "groot-component-library";

export default function ToolBarWithComponent() {
  const globalEmitter = useGlobalEventEmitter();
  const navigate = useNavigate();

  const handleFile = (type: "save" | "load") => {
    globalEmitter.emit("file", type);
  };

  const handleElement = (type: "delete") => {
    globalEmitter.emit(type);
  };

  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("add", ev.currentTarget.id);
  };
  return (
    <S.ToolBarWrapper>
      <Column>
        <Column tag="div" style={{ gap: "10px" }}>
          <button onClick={() => handleFile("save")}>save</button>
          <button onClick={() => handleFile("load")}>load</button>
          <button onClick={() => handleElement("delete")}>delete</button>
          <button onClick={(ev) => handleButton(ev)} id={"input"} key={"input"}>
            input
          </button>
          <button
            onClick={(ev) => handleButton(ev)}
            id={"header"}
            key={"header"}
          >
            header
          </button>
          <button onClick={(ev) => handleButton(ev)} id={"nav"} key={"nav"}>
            nav
          </button>
          <button onClick={(ev) => handleButton(ev)} id={"div"} key={"div"}>
            div
          </button>
          <button onClick={() => navigate("/")}>result</button>
        </Column>
        <S.CurrentStatusWrapper></S.CurrentStatusWrapper>
      </Column>
    </S.ToolBarWrapper>
  );
}
