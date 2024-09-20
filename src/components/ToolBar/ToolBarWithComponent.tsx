import { createRoot } from "react-dom/client";

import * as S from "./emotion";
import DraggableComponent from "../DraggableComponent";
import { generateRandomString } from "../../utils/utils";
import Input from "../../componentList/Input";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
// import { allHtmlTags } from "../../constant/constant";

export default function ToolBarWithComponent() {
  const globalEmitter = useGlobalEventEmitter();
  const createDraggableElement2 = () => {
    // 새로운 div 요소 생성
    const newElement = document.createElement("div");
    newElement.style["width"] = "0px";
    newElement.style["height"] = "0px";

    const defaultElement = document.getElementById("init") as HTMLDivElement;
    // newElement.style.position = "absolute"; // 필수적인 스타일 설정
    // newElement.style.top = "100px"; // 초기 위치 설정
    // newElement.style.left = "100px"; // 초기 위치 설정

    // 생성된 div를 body에 추가
    defaultElement.appendChild(newElement);

    // React 컴포넌트를 새로 생성된 div에 렌더링
    const root = createRoot(newElement);
    root.render(
      <DraggableComponent id={generateRandomString(10)}>
        <Input name="a" />
      </DraggableComponent>
    );
  };
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
      <button onClick={createDraggableElement2}>Draggable 컴포넌트 추가</button>
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
