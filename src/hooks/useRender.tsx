import { ComponentListType, ElementStructure } from "./atom";

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
      for (const [, e] of elementData.inner) {
        const innerElement = createHTMLElement(e);
        element.appendChild(innerElement);
      }
      Object.values(elementData.inner).forEach((innerElementData) => {
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

  const parseElementsToHTML = (elements: ComponentListType) => {
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
