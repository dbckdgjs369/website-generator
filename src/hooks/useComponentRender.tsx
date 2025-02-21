/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { css } from "@emotion/react";
import { useAtomValue } from "jotai";
import { createRoot } from "react-dom/client";

import DraggableComponent from "../components/DraggableComponent";
import { ReactNode } from "react";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import NavigationBar, {
  NavigationBarType,
} from "../componentList/NavigationBar";
import Typo, { TypoType } from "../componentList/Typo";
import {
  ComponentListType,
  ElementStructure,
  Position,
  SelectedIDAtom,
} from "./atom";

const COMPONENT_MAP = {
  nav: (props: NavigationBarType) => <NavigationBar {...props} />,
  typo: (props: TypoType) => <Typo {...props} />,
};

export default function useComponentRender() {
  const g = useGlobalEventEmitter();
  const selectedID = useAtomValue(SelectedIDAtom);
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
        <div css={id === selectedID && selectedCss}>{component}</div>
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
    elements: ComponentListType,
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

  // const parseElementsToHTML = (
  //   newElements: ElementStructure[],
  //   mode: "edit" | "result"
  // ) => {
  //   const container = document.getElementById("init");
  //   if (!container) return;

  //   const existingElements = new Map<string, HTMLElement>();

  //   // 현재 컨테이너에 있는 요소들을 Map에 저장
  //   Array.from(container.children).forEach((child) => {
  //     const key = child.getAttribute("data-key");
  //     if (key) {
  //       existingElements.set(key, child as HTMLElement);
  //     }
  //   });

  //   newElements.forEach((elementData) => {
  //     const key = elementData.id; // id를 키값으로 사용한다고 가정
  //     const existingElement = existingElements.get(key);

  //     if (existingElement) {
  //       // 기존 요소가 있다면 업데이트
  //       const newElement = createHTMLElement(elementData, mode === "result");
  //       container.replaceChild(newElement!, existingElement);
  //       existingElements.delete(key);
  //     } else {
  //       // 새로운 요소라면 추가
  //       const newElement = createHTMLElement(elementData, mode === "result");
  //       if (newElement) {
  //         container.appendChild(newElement);
  //       }
  //     }
  //   });

  //   // 기존에 있었지만 새로운 JSON에서 사라진 요소는 제거
  //   existingElements.forEach((element) => container.removeChild(element));
  // };

  return { parseElementsToHTML };
}

const selectedCss = css`
  display: inline-block;
  border: 2px solid #3498db;
  box-shadow: 0 0 3px rgba(52, 152, 219, 0.7);
`;
