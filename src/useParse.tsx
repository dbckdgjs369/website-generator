import { CSSProperties } from "react";

type Element = "div" | "body" | "button";

type JsonStructure = {
  [key in Element]: {
    style?: CSSProperties;
    text?: string; // Make 'text' property optional
    children?: JsonStructure;
  };
};

export default function useParse() {
  function createHtmlElement(
    data: JsonStructure[keyof JsonStructure]
  ): JSX.Element {
    const { style, text } = data;

    // Create a div element with the specified style
    return <div style={style}>{text}</div>;
  }

  function convertJsonToReact(jsonData: JsonStructure): JSX.Element[] {
    // If jsonData is an object, map over its keys and create elements
    return Object.keys(jsonData).map((key) => (
      <div key={key}>{createHtmlElement(jsonData[key])}</div>
    ));
  }

  // function convertJsonToReact(jsonData) {
  //   // Check if jsonData is an object
  //   if (typeof jsonData !== "object" || jsonData === null) {
  //     return null;
  //   }

  //   // If jsonData is an array, map over it
  //   if (Array.isArray(jsonData)) {
  //     return jsonData.map((item, index) => (
  //       <div key={index}>{convertJsonToReact(item)}</div>
  //     ));
  //   }

  //   // If jsonData is an object, map over its keys and create elements
  //   return Object.keys(jsonData).map((key) => (
  //     <div key={key}>{createHtmlElement(jsonData[key])}</div>
  //   ));
  // }
  return { convertJsonToReact };
}
