import React, { useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

const gridSize = 50; // 그리드 크기

const DraggableComponent = ({ id }: { id: string }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 위치 보정 함수
  const snapToGrid = (pos: { x: number; y: number }) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  };

  // 드래그 끝났을 때 호출되는 함수
  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    console.log("::data", data);
    const snappedPosition = snapToGrid({ x: data.x, y: data.y });
    setPosition(snappedPosition);
    // setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable position={position} onStop={handleStop}>
      <div
        className={`draggable-box-${id}`}
        style={{ width: 100, height: 100, backgroundColor: "lightblue" }}
      >
        드래그 해보세요
      </div>
    </Draggable>
  );
};

export default DraggableComponent;
