import { useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

const gridSize = 50; // 그리드 크기

export default function DraggableComponent({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
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
  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    const snappedPosition = snapToGrid({ x: data.x, y: data.y });
    setPosition(snappedPosition);
  };

  return (
    <Draggable position={position} onStop={handleStop}>
      <div id={`draggable-box-${id}`} className={`draggable-box-${id}`}>
        {children}
      </div>
    </Draggable>
  );
}