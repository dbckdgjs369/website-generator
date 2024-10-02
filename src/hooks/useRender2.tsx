/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from "react-dom/client";
import DraggableComponent from "../components/DraggableComponent";
import { ReactNode } from "react";
import Input from "../componentList/Input";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { Position } from "./useRender";
import Header, { HeaderType } from "../componentList/Header";
import NavigationBar, {
  NavigationBarType,
} from "../componentList/NavigationBar";

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
  props?: Record<string, string>;
}

const COMPONENT_MAP = {
  input: ({ name }: { name: string }) => <Input name={name} />,
  header: (props: HeaderType) => <Header {...props} />,
  nav: (props: NavigationBarType) => <NavigationBar {...props} />,
};

export default function useRender2() {
  const g = useGlobalEventEmitter();
  const createDraggableElement = ({
    id,
    position,
    component,
    disabled,
  }: {
    id: string;
    position?: Position;
    component: ReactNode;
    disabled?: boolean;
  }) => {
    // 새로운 div 요소 생성
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
        isDraggable={disabled}
        position={position}
        emitter={g}
        id={id}
        handlePosition={(pos) => console.log("pos", pos)}
      >
        {component}
      </DraggableComponent>
    );
  };
  const createHTMLElement = (
    elementData: ElementStructure,
    disabled: boolean
  ) => {
    if (elementData.root) {
      createDraggableElement({
        id: elementData.id,
        position: elementData.position,
        //@ts-ignore
        component: COMPONENT_MAP[elementData.type]({ ...elementData.props }),
        disabled: disabled,
      });

      return;
    }
    const element = document.createElement(elementData.type);
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
        const innerElement = createHTMLElement(innerElementData, disabled);
        if (innerElement) {
          element.appendChild(innerElement);
        }
      });
      // return element;
    }
    return element;
  };

  const parseElementsToHTML = (
    elements: ElementStructure[],
    mode: "edit" | "result"
  ) => {
    const container = document.getElementById("init");
    while (container?.firstChild) {
      container.removeChild(container.firstChild);
    }
    if (container) {
      elements.forEach((elementData) => {
        const element = createHTMLElement(elementData, mode === "result");
        if (element) {
          container.appendChild(element);
        }
      });
    }
  };

  return { parseElementsToHTML };
}
