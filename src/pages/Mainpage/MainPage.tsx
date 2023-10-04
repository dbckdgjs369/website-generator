import { useRef, useState } from "react";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { ElementTagType, HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";

const kebabCase = "fooBar1ShowBaz2".replace(/([A-Z0-9])/g, "-$1").toLowerCase();

const cssCustomPropertySyntax = `--${kebabCase}`;

console.log({ kebabCase, cssCustomPropertySyntax });

export default function MainPage() {
  const divRef = useRef<HTMLDivElement>(null);
  const [json, setJson] = useState<ElementTagType>();
  // const [text, setText] = useState({
  //   __html: "",
  // });
  const { jsonToHtml } = useMakeDOM();
  // const { jsonToHtml } = useParse();
  const globalEmitter = useGlobalEventEmitter();
  globalEmitter.on("click", (name: HTMLTag) => {
    const updatedJsonData = { ...json };
    if (updatedJsonData[name]) {
      (updatedJsonData[name] as ElementTagType[]).push({
        id: "test",
        style: {
          border: "1px solid black",
          height: "50px",
          fontSize: "100px",
        },
        text: "1",
      });
    } else {
      (updatedJsonData[name] as ElementTagType[]) = [
        {
          id: "test",
          style: {
            border: "1px solid black",
            height: "50px",
            "font-size": "20px",
            "&:focus": {
              border: "1px solid red",
            },
          },
          text: "2",
        },
      ];
    }
    setJson(updatedJsonData);
    jsonToHtml(updatedJsonData, divRef.current as HTMLElement);
    setJson(updatedJsonData);
  });

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      console.log(ev.target.id);
    }
  };
  return <div ref={divRef} onClick={getID} />;
}
