import { useEffect, useState } from "react";
import { ElementStructure } from "./useRender";
import { renderToStaticMarkup } from "react-dom/server";

export default function useElementStructure(
  component: React.ReactElement
): ElementStructure | null {
  const [structure, setStructure] = useState<ElementStructure | null>(null);

  const html = renderToStaticMarkup(component);
  console.log("::html", html);
  const parser = new DOMParser();
  parser.parseFromString;
  const temp = parser.parseFromString(html, "text/html").body.children[0]
    .attributes["style"];
  console.log("temp", temp);
  const doc = parser.parseFromString(html, "text/html").body.children[0];
  const makeJson = (doc: Element) => {
    while (doc.hasChildNodes()) {
      doc.attributes[0];
      // doc.
    }
  };
  doc.hasChildNodes;
  console.log("::doc", doc);

  // function parseNode(node: Node): ElementStructure {
  //   console.log("::node", node);
  //   if (node.nodeType === Node.ELEMENT_NODE) {
  //     const element = node as HTMLElement;
  //     const id = element.id || "";
  //     const type = element.tagName.toLowerCase() as keyof HTMLElementTagNameMap;
  //     const style = element.style.cssText
  //       ? parseStyle(element.style)
  //       : undefined;
  //     const text = element.textContent?.trim() || "";
  //     // const events: { [key: string]: string } = {};

  //     // Event attributes
  //     // const eventAttributes = [
  //     //   "onclick",
  //     //   "onchange",
  //     //   "onmouseover",
  //     //   "onmouseout",
  //     // ];
  //     // eventAttributes.forEach((event) => {
  //     //   if (element.hasAttribute(event)) {
  //     //     events[event] = element.getAttribute(event) || "";
  //     //   }
  //     // });

  //     return {
  //       id,
  //       type,
  //       inner: Array.from(element.childNodes).map(parseNode),
  //       style,
  //       text,
  //       // events: Object.keys(events).length > 0 ? events : undefined,
  //     };
  //   } else if (node.nodeType === Node.TEXT_NODE) {
  //     // return {
  //     //   text: (node.nodeValue?.trim() as string) || "",
  //     // };
  //   }
  //   return { id: "", type: "div" }; // 기본값
  // }

  // function parseStyle(style: CSSStyleDeclaration): { [key: string]: string } {
  //   const styleObject: { [key: string]: string } = {};
  //   for (let i = 0; i < style.length; i++) {
  //     const key = style[i];
  //     styleObject[key] = style.getPropertyValue(key);
  //   }
  //   return styleObject;
  // }

  // setStructure(parseNode(doc.body));

  return structure;
}
