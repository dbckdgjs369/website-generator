/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from "react-dom/client";
import DraggableComponent from "../components/DraggableComponent";
import { ReactNode } from "react";
import Input from "../componentList/Input";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { Position } from "./useRender";

type StringKeyStringValueObject = {
  [key: string]: string | { [key: string]: string };
};
export interface ElementStructure {
  id: string;
  type: keyof HTMLElementTagNameMap;
  inner?: ElementStructure[];
  style?: CSSStyleDeclaration | StringKeyStringValueObject;
  text?: string;
  events?: string;
  position?: Position;
  root?: boolean;
}

const COMPONENT_MAP = {
  input: <Input name="" />,
};

export default function useRender2() {
  const g = useGlobalEventEmitter();
  const createDraggableElement = ({
    id,
    position,
    component,
  }: {
    id: string;
    position: any;
    component: ReactNode;
  }) => {
    // 새로운 div 요소 생성
    console.log("::here?", component);
    const newElement = document.createElement("div");
    newElement.style["width"] = "0px";
    newElement.style["height"] = "0px";
    const defaultElement = document.getElementById("init") as HTMLDivElement;
    // newElement.style.top = "100px"; // 초기 위치 설정
    // newElement.style.left = "100px"; // 초기 위치 설정

    // 생성된 div를 body에 추가
    defaultElement.appendChild(newElement);

    // React 컴포넌트를 새로 생성된 div에 렌더링
    const root = createRoot(newElement);
    root.render(
      <DraggableComponent
        position={position}
        emitter={g}
        id={id}
        handlePosition={(pos) => console.log("pos", pos)}
      >
        {component}
      </DraggableComponent>
    );
  };
  const createHTMLElement = (elementData: ElementStructure) => {
    if (elementData.root) {
      createDraggableElement({
        id: elementData.id,
        position: elementData.position,
        component: COMPONENT_MAP[elementData.type as "input"],
      });
      // if (elementData.position) {
      //   const e = document.getElementById(elementData.id);
      //   console.log("::elementData.id", elementData.id, e);
      //   if (e) {
      //     console.log(
      //       "position",
      //       `translate(${elementData.position.x}px,${elementData.position.y}px)`
      //     );
      //     e.style[
      //       "transform"
      //     ] = `translate(${elementData.position.x}px,${elementData.position.y}px)`;
      //   }
      // }
      return;
    }
    const element = document.createElement(elementData.type);
    element.draggable = true;
    element.id = elementData.id;

    if (elementData.style) {
      const styles = elementData.style;
      for (const key in styles) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element.style[key as any] = styles[key];
      }
    }
    if (elementData.text) {
      element.textContent = elementData.text;
    }
    if (elementData.inner) {
      elementData.inner.forEach((innerElementData) => {
        const innerElement = createHTMLElement(innerElementData);
        if (innerElement) {
          element.appendChild(innerElement);
        }
      });
      // return element;
    }
    return element;
  };

  const parseElementsToHTML = (elements: ElementStructure[]) => {
    const container = document.getElementById("init");
    while (container?.firstChild) {
      container.removeChild(container.firstChild);
    }
    if (container) {
      elements.forEach((elementData) => {
        const element = createHTMLElement(elementData);
        if (element) {
          container.appendChild(element);
        }
      });
    }
  };

  return { parseElementsToHTML };
}
