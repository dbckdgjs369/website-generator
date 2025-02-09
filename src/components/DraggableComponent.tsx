import { useRef } from "react";
import { useSetAtom } from "jotai";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { GlobalEmitterType } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { Position } from "../hooks/useRender";
import { SelectedIDAtom } from "../hooks/atom";

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
  const nodeRef = useRef(null);
  const setSelectedID = useSetAtom(SelectedIDAtom);
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
      nodeRef={nodeRef}
      bounds={{
        top: 0,
        right: window.innerWidth - 600,
        bottom: window.innerHeight,
        left: 0,
      }}
      position={position}
      onStop={handleStop}
      disabled={isDraggable}
      onMouseDown={(ev) => {
        ev.preventDefault();
        setSelectedID(id);
      }}
    >
      <div id={id} className={id} ref={nodeRef}>
        {children}
      </div>
    </Draggable>
  );
}
