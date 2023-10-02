import * as S from "./emotion";

interface ToolBarInterface {
  handleClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ToolBar({ handleClick }: ToolBarInterface) {
  // const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
  //   console.log("ev", ev.currentTarget.id);
  // };
  return (
    <S.ToolBarWrapper>
      <button onClick={handleClick} id="div">
        div
      </button>
      <button onClick={handleClick} id="button">
        button
      </button>
    </S.ToolBarWrapper>
  );
}
