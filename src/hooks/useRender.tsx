type StringKeyStringValueObject = {
  [key: string]: string | { [key: string]: string };
};

export type Position = { x: number; y: number };
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

export default function useRender() {
  const createHTMLElement = (elementData: ElementStructure): HTMLElement => {
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
        element.appendChild(innerElement);
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
        container.appendChild(element);
      });
    }
  };

  return { parseElementsToHTML };
}
