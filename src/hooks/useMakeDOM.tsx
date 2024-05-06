import { CSSProperties, useRef } from "react";

export type HTMLTag = keyof HTMLElementTagNameMap;
type StringKeyStringValueObject = {
  [key: string]: string | { [key: string]: string };
};

export type ElementTagType = {
  style?: CSSProperties | StringKeyStringValueObject; //@TODO 추후에 style 넣을 때 kebab으로 바꿔서 넣어줘야할 듯
  text?: string;
  id?: string;
} & {
  [key in HTMLTag]?: key extends "style"
    ? CSSProperties
    : key extends "text" & "id"
    ? string
    : ElementTagType[];
};

export default function useMakeDOM() {
  const rootRef = useRef<HTMLElement>(null);
  const removeChildElements = (divElement: HTMLElement) => {
    if (divElement) {
      while (divElement.firstChild) {
        divElement.removeChild(divElement.firstChild);
      }
    }
  };

  function jsonToHtml(json: ElementTagType, ref: HTMLElement) {
    removeChildElements(ref);
    for (const tag in json) {
      switch (tag) {
        case "id": {
          ref.setAttribute("id", json[tag] as string);
          break;
        }
        case "text": {
          ref.textContent = json[tag] as string;
          break;
        }
        case "style": {
          const styles = json[tag] as CSSProperties;
          if (ref === null) return;
          for (const styleKey in styles) {
            ref.style[styleKey as never] = styles[
              styleKey as keyof CSSProperties
            ] as string;
          }
          break;
        }

        default: {
          const otherValueArray = json[tag as HTMLTag] as ElementTagType[];
          otherValueArray.forEach((element) => {
            const elementRef = document.createElement(tag);
            ref.appendChild(elementRef);
            jsonToHtml(element, elementRef);
          });
          break;
        }
      }
    }
  }

  return { rootRef, jsonToHtml };
}
