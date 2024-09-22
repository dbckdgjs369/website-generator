import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";

export default function ToolBarWithComponent() {
  const globalEmitter = useGlobalEventEmitter();

  const handleFile = (type: "save" | "load") => {
    globalEmitter.emit("file", type);
  };

  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("add", ev.currentTarget.id);
  };
  return (
    <S.ToolBarWrapper>
      <button onClick={() => handleFile("save")}>save</button>
      <button onClick={() => handleFile("load")}>load</button>
      <button onClick={(ev) => handleButton(ev)} id={"input"} key={"input"}>
        input
      </button>
      <button onClick={(ev) => handleButton(ev)} id={"div"} key={"div"}>
        div
      </button>
    </S.ToolBarWrapper>
  );
}
