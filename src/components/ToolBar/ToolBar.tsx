import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";

export default function ToolBar() {
  const globalEmitter = useGlobalEventEmitter();

  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("click", ev.currentTarget.id);
    globalEmitter.removeAllListeners();
  };

  return (
    <S.ToolBarWrapper>
      <button onClick={(ev) => handleButton(ev)} id="div">
        div
      </button>
      <button onClick={handleButton} id="button">
        button
      </button>
    </S.ToolBarWrapper>
  );
}
