import { createRoot } from "react-dom/client";
import DraggableComponent from "../components/DraggableComponent";
import { generateRandomString } from "../utils/utils";
import { ReactNode } from "react";
import Input from "../componentList/Input";

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
  root?: boolean;
}

const COMPONENT_MAP = {
  input: <Input name="" />,
};

export default function useRender2() {
  const createDraggableElement = (component: ReactNode) => {
    // 새로운 div 요소 생성
    console.log(":::??");
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
      <DraggableComponent id={generateRandomString(10)}>
        {component}
      </DraggableComponent>
    );
  };
  const createHTMLElement = (elementData: ElementStructure) => {
    if (elementData.root) {
      console.log(":::here??", elementData.type);
      createDraggableElement(COMPONENT_MAP[elementData.type as "input"]);
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
    // if (elementData.events) {
    //   element.addEventListener("click", () => {
    //     fetch("https://jsonplaceholder.typicode.com/todos/1");
    //   });
    // }
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
