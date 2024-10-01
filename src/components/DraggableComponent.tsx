import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { GlobalEmitterType } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { Position } from "../hooks/useRender";

const gridSize = 50; // 그리드 크기

export default function DraggableComponent({
  id,
  position,
  handlePosition,
  emitter,
  isDraggable,
  children,
}: {
  id: string;
  position?: Position;
  emitter?: GlobalEmitterType;
  handlePosition?: (position: Position) => void;
  isDraggable?: boolean;
  children: React.ReactNode;
}) {
  // 위치 보정 함수
  const snapToGrid = (pos: Position) => {
    const newX = Math.round(pos.x / gridSize) * gridSize;
    const newY = Math.round(pos.y / gridSize) * gridSize;
    return { x: newX, y: newY };
  };

  // 드래그 끝났을 때 호출되는 함수
  const handleStop = (ev: DraggableEvent, data: DraggableData) => {
    ev.preventDefault();
    const snappedPosition = snapToGrid({ x: data.x, y: data.y });
    handlePosition?.(snappedPosition);
    emitter?.emit("position", snappedPosition, id);
  };

  return (
    <Draggable
      position={position}
      onStop={handleStop}
      disabled={isDraggable}
      onMouseDown={() => emitter?.emit("id", id)}
    >
      <div id={id} className={id}>
        {children}
      </div>
    </Draggable>
  );
}
