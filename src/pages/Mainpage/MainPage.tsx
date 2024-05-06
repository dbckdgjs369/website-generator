import { useEffect, useRef, useState } from "react";

import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { ElementTagType, HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";
import { data } from "../../assets/testArray";
import useRender from "../../hooks/useRender";

const DEFAULT_STYLE = {
  display: "flex",
  border: "1px solid black",
  width: "100%",
  fontSize: "30px",
};

export default function MainPage() {
  const [selectedID, setSelectedID] = useState("init");
  const { parseElementsToHTML } = useRender();
  const divRef = useRef<HTMLDivElement>(null);
  const [json, setJson] = useState<ElementTagType>({
    div: [
      {
        id: "init",
        style: { ...DEFAULT_STYLE, flexDirection: "column" },
      },
    ],
  });
  const { jsonToHtml, generateRandomString } = useMakeDOM();
  const globalEmitter = useGlobalEventEmitter();
  const handleAddStyle = (style: string) => {
    console.log("style", style);
    // 추후 구현
  };

  const handleAddElement = (name: HTMLTag) => {
    addElement(name, selectedID);
  };
  useEffect(() => {
    globalEmitter.on("click", handleAddElement);
    globalEmitter.on("style", handleAddStyle);
    return () => {
      globalEmitter.off("click", handleAddElement);
      globalEmitter.off("click", handleAddStyle);
    };
  }, [selectedID, json]);

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    parseElementsToHTML(data);
  }, [json, jsonToHtml]);

  function getObjectById(
    id: string,
    data: ElementTagType
  ): ElementTagType | undefined {
    for (const key in data) {
      switch (key) {
        case "id":
        case "style":
        case "text": {
          break;
        }
        default: {
          const idValue = data[key as HTMLTag] as ElementTagType[];
          for (const element of idValue) {
            if (element.id === id) {
              return element;
            } else {
              const result = getObjectById(id, element);
              if (result) {
                return result;
              }
            }
          }
        }
      }
    }
  }

  const addElement = (addObjectTag: HTMLTag, targetObjectID: string) => {
    const updatedJsonData = { ...json };
    const foundObject = getObjectById(targetObjectID, updatedJsonData);
    if (!foundObject) return;
    if (foundObject[addObjectTag]) {
      (foundObject[addObjectTag] as ElementTagType[]).push({
        id: generateRandomString(10),
        style: DEFAULT_STYLE,
        text: addObjectTag,
      });
    } else {
      (foundObject[addObjectTag]! as ElementTagType[]) = [
        {
          id: generateRandomString(10),
          style: DEFAULT_STYLE,
          text: addObjectTag,
        },
      ];
    }
    setJson(updatedJsonData);
  };

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      setSelectedID(ev.target.id);
    }
  };

  return (
    <div id="init" ref={divRef} onClick={getID} style={{ height: "100vh" }} />
  );
}
