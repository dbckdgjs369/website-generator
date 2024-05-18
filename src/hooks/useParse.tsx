import { CSSProperties } from "react";
import { ElementTagType, HTMLTag } from "../types";

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
