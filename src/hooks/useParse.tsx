import { CSSProperties } from "react";

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

export default function useParse() {
  function jsonToHtml(json: ElementTagType) {
    let html = "";
    for (const tag in json) {
      switch (tag) {
        case "id": {
          html += `id="${json[tag]}"`;
          break;
        }
        case "text": {
          html += json[tag];
          break;
        }
        case "style": {
          const styles = json[tag] as CSSProperties;
          let styleString = "";
          for (const styleKey in styles) {
            styleString += `${styleKey}: ${
              styles[styleKey as keyof CSSProperties]
            };`;
          }
          html += `style="${styleString}">`;
          break;
        }

        default: {
          const otherValueArray = json[tag as HTMLTag] as ElementTagType[];
          otherValueArray.forEach((element) => {
            html += `<${tag} ${jsonToHtml(element)}</${tag}>`;
          });
          break;
        }
      }
    }
    return html;
  }

  return { jsonToHtml };
}
