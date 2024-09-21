import { createRoot } from "react-dom/client";

import DraggableComponent from "../../components/DraggableComponent";
import { Column, Row } from "../../components/Flex";

export default function DNDPage() {
  const createDraggableElement = () => {
    // 새로운 div 요소 생성
    const newElement = document.createElement("div");
    newElement.style.position = "absolute"; // 필수적인 스타일 설정
    // newElement.style.top = "100px"; // 초기 위치 설정
    // newElement.style.left = "100px"; // 초기 위치 설정
    newElement.style["width"] = "0px";
    newElement.style["height"] = "0px";
    // 생성된 div를 body에 추가
    document.body.appendChild(newElement);

    // React 컴포넌트를 새로 생성된 div에 렌더링
    const root = createRoot(newElement);
    root.render(
      <DraggableComponent id="24" position={{ x: 0, y: 0 }}>
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "100%",
            background: "red",
          }}
        >
          hello
        </div>
      </DraggableComponent>
    );
  };
  return (
    // <Draggable>
    //   <div>a</div>
    <>
      <button
        onClick={() => {
          const item = document.getElementById(`draggable-box-1`);
          const newDiv = document.createElement("div");
          newDiv.style["height"] = "100px";
          newDiv.style["border"] = "1px solid";
          newDiv.style["width"] = "100px";
          item?.appendChild(newDiv);
        }}
      >
        add
      </button>
      <button onClick={createDraggableElement}>Draggable 컴포넌트 추가</button>
      <div style={{ display: "flex", flexDirection: "row" }}></div>
      <Column>
        <DraggableComponent id="1" position={{ x: 0, y: 0 }}>
          <div style={{ width: "100%", height: "100px", background: "black" }}>
            Header
          </div>
        </DraggableComponent>
        <Row>
          <DraggableComponent id="3" position={{ x: 0, y: 0 }}>
            <div
              style={{
                width: "300px",
                background: "blue",
                height: "calc(100vh - 100px)",
              }}
            >
              sidebar
            </div>
          </DraggableComponent>
          <div>content</div>
        </Row>
      </Column>
    </>
    // </Draggable>
  );
}
