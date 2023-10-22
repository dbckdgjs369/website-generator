import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { useRef } from "react";

export default function ToolBar() {
  const globalEmitter = useGlobalEventEmitter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 새로 생성된 div에 emitter가 중첩되는 문제발생
  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("click", ev.currentTarget.id);
    globalEmitter.removeAllListeners();
  };

  const addStyle = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("style", textareaRef.current?.value);
    globalEmitter.removeAllListeners();
  };

  return (
    <S.ToolBarWrapper>
      <S.CurrentWrapper>여기에 클릭한 요소가 보여야 됌</S.CurrentWrapper>
      <S.ButtonWrapper>
        <S.Button>left</S.Button>
        <S.Button>center</S.Button>
        <S.Button>right</S.Button>
      </S.ButtonWrapper>
      <S.CurrentWrapper>
        <textarea ref={textareaRef} />
        <button onClick={addStyle}>스타일 추가</button>
      </S.CurrentWrapper>
      <button onClick={(ev) => handleButton(ev)} id="div">
        div
      </button>
      <button onClick={handleButton} id="button">
        button
      </button>
    </S.ToolBarWrapper>
  );
}
