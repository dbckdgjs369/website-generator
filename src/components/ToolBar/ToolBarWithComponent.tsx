import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
// import { allHtmlTags } from "../../constant/constant";

export default function ToolBarWithComponent() {
  const globalEmitter = useGlobalEventEmitter();

  const handleSave = () => {
    const currentPage = document.documentElement.outerHTML;
    console.log("::current", currentPage);
  };
  const handleButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    globalEmitter.emit("add", ev.currentTarget.id);
  };
  return (
    <S.ToolBarWrapper>
      <button onClick={handleSave}>save</button>
      <button onClick={(ev) => handleButton(ev)} id={"input"} key={"input"}>
        input
      </button>
      <button onClick={(ev) => handleButton(ev)} id={"div"} key={"div"}>
        div
      </button>
    </S.ToolBarWrapper>
  );
}
