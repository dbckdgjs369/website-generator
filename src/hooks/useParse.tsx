import { CSSProperties, useEffect, useState } from "react";

export type HTMLTag = keyof HTMLElementTagNameMap;

export type Element = {
  style?: CSSProperties;
  text?: string;
} & {
  [key in HTMLTag]?: key extends "style" ? CSSProperties : Element;
};

const temp: Element = {
  div: {
    style: {
      border: "5px solid white",
      height: "calc( 100vh - 10px )",
      width: "calc( 100vw - 10px )",
    },
    div: {
      style: {
        border: "1px solid red",
      },
      text: "hello!!",
      div: {
        style: {
          border: "1px solid red",
        },
        text: "hello2!!",
      },
    },
  },
};

export default function useParse() {
  const [text, setText] = useState({
    __html: "",
  });

  function jsonToHtml(json: Element) {
    let html = "";
    for (const tag in json) {
      switch (tag) {
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
          const otherValue = json[tag as HTMLTag] as Element;
          html += `<${tag} ${jsonToHtml(otherValue)}</${tag}>`;
          break;
        }
      }
    }
    return html;
  }

  useEffect(() => {
    console.log("JSON", jsonToHtml(temp));
    setText({ __html: jsonToHtml(temp as Element) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <body dangerouslySetInnerHTML={text as { __html: string }} />;
}
