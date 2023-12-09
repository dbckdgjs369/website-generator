type StringKeyStringValueObject = {
  [key: string]: string | { [key: string]: string };
};
export interface ElementStructure {
  id: string;
  type: keyof HTMLElementTagNameMap;
  inner?: ElementStructure[];
  style?: CSSStyleDeclaration | StringKeyStringValueObject;
  text?: string;
}

export default function useRender() {
  function createHTMLElement(elementData: ElementStructure): HTMLElement {
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
        const innerElement = createHTMLElement(innerElementData);
        element.appendChild(innerElement);
      });
      // return element;
    }
    return element;
  }

  function parseElementsToHTML(elements: ElementStructure[]): void {
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
  }

  return { parseElementsToHTML };
}
