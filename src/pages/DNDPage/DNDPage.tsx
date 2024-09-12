import React from "react";
import Draggable from "react-draggable";
import DraggableComponent from "../../components/DraggableComponent";

export default function DNDPage() {
  return (
    // <Draggable>
    //   <div>a</div>
    <>
      <DraggableComponent id="1" />
      <DraggableComponent id="3" />
    </>
    // </Draggable>
  );
}
