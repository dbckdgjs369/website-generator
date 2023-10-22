import { useEffect, useRef, useState } from "react";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { ElementTagType, HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";
import testData from "../../assets/test.json";

export default function MainPage() {
  const [selectedID, setSelectedID] = useState("init");
  const divRef = useRef<HTMLDivElement>(null);
  const [json, setJson] = useState<ElementTagType>({
    div: [
      {
        id: "init",
        style: {
          display: "flex",
          flexDirection: "column",
          border: "1px solid black",
          fontSize: "40px",
        },
      },
    ],
  });
  const { jsonToHtml, generateRandomString } = useMakeDOM();
  const globalEmitter = useGlobalEventEmitter();
  const addAttributeToElement = () => {};

  const handleAddElement = (name: HTMLTag) => {
    console.log("selected in emiiter", selectedID);
    addElement(name, selectedID);
  };
  useEffect(() => {
    console.log("selectedID", selectedID);
    globalEmitter.on("click", handleAddElement);
    return () => {
      globalEmitter.off("click", handleAddElement);
    };
  }, [selectedID, json]);

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    jsonToHtml(json!, divRef.current as HTMLElement);
  }, [json, jsonToHtml]);

  function getObjectById(
    id: string,
    data: ElementTagType
  ): ElementTagType | undefined {
    for (const key in data) {
      switch (key) {
        case "id": {
          break;
        }
        case "style": {
          break;
        }
        case "text": {
          break;
        }
        default: {
          const temp = data[key as HTMLTag] as ElementTagType[];
          for (const element of temp) {
            if (element.id === id) {
              console.log("match!!", element);
              return element;
            } else {
              const result = getObjectById(id, element);
              if (result) {
                return result; // Return the result of the recursive call
              }
            }
          }
        }
      }
    }
  }

  // useEffect(() => {
  //   const temp = getObjectById("fgehQpPqXh", testData as ElementTagType);
  //   console.log("asldkgjaslkdgj", temp);
  // }, []);
  useEffect(() => {
    console.log("selected", selectedID);
  }, [selectedID]);

  const addElement = (addObjectTag: HTMLTag, targetObjectID: string) => {
    const updatedJsonData = { ...json };
    const foundObject = getObjectById(targetObjectID, updatedJsonData);
    console.log("foundObject", targetObjectID, foundObject, updatedJsonData);
    if (!foundObject) return;
    if (foundObject[addObjectTag]) {
      (foundObject[addObjectTag] as ElementTagType[]).push({
        id: generateRandomString(10),
        style: {
          display: "flex",
          // flexDirection: "column",
          border: "1px solid black",
          // height: "30px",
          width: "100%",
          fontSize: "40px",
        },
        text: "1",
      });
    } else {
      (foundObject[addObjectTag]! as ElementTagType[]) = [
        {
          id: generateRandomString(10),
          style: {
            display: "flex",
            // flexDirection: "column",
            border: "1px solid black",
            // height: "30px",
            width: "100%",
            fontSize: "40px",
          },
          text: "2",
        },
      ];
    }
    console.log("update", updatedJsonData);
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
