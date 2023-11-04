import { CSSProperties, useEffect, useState } from "react";

type HTMLTag = keyof HTMLElementTagNameMap;

type Element = {
  style?: CSSProperties;
  text?: string;
} & {
  [key in HTMLTag]?: key extends "style" ? CSSProperties : Element;
};

function App() {
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
  }, []);
  return <body dangerouslySetInnerHTML={text as { __html: string }} />;
}

export default App;
