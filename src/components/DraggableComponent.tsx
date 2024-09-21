// import { useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { GlobalEmitterType } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";

const gridSize = 50; // 그리드 크기

export default function DraggableComponent({
  id,
  position,
  handlePosition,
  emitter,
  children,
}: {
  id: string;
  position: { x: number; y: number };
  emitter: GlobalEmitterType;
  handlePosition: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}) {
  // const [position, setPosition] = useState<{ x: number; y: number }>({
  //   x: 0,
  //   y: 0,
  // });

  // 위치 보정 함수
  const snapToGrid = (pos: { x: number; y: number }) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  };

  // 드래그 끝났을 때 호출되는 함수
  const handleStop = (ev: DraggableEvent, data: DraggableData) => {
    ev.preventDefault();
    const snappedPosition = snapToGrid({ x: data.x, y: data.y });
    // setPosition(snappedPosition);
    console.log(":::drag end position", snappedPosition);
    handlePosition(snappedPosition);
    emitter.emit("test", snappedPosition, id);
    // console.log("::eventEmitter", eventEmitter);
    // eventEmitter?.emit("test", snappedPosition);
  };

  return (
    <Draggable position={position} onStop={handleStop}>
      <div id={id} className={id}>
        {children}
      </div>
    </Draggable>
  );
}
