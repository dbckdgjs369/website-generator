import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";

export default function ToolBar() {
  const globalEmitter = useGlobalEventEmitter();
  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    globalEmitter.emit("click", ev.currentTarget.id);
    console.log("here");
  };
  return (
    <S.ToolBarWrapper>
      <button onClick={handleButton} id="div">
        div
      </button>
      <button onClick={handleButton} id="button">
        button
      </button>
    </S.ToolBarWrapper>
  );
}
