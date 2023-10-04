import { useEffect, useRef, useState } from "react";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { ElementTagType, HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";
import testData from "../../assets/test.json";

const kebabCase = "fooBar1ShowBaz2".replace(/([A-Z0-9])/g, "-$1").toLowerCase();

const cssCustomPropertySyntax = `--${kebabCase}`;

console.log({ kebabCase, cssCustomPropertySyntax });

export default function MainPage() {
  const divRef = useRef<HTMLDivElement>(null);
  const [json, setJson] = useState<ElementTagType>();
  const { jsonToHtml, generateRandomString } = useMakeDOM();
  const globalEmitter = useGlobalEventEmitter();
  globalEmitter.on("click", (name: HTMLTag) => {
    const updatedJsonData = { ...json };
    if (updatedJsonData[name]) {
      (updatedJsonData[name] as ElementTagType[]).push({
        id: generateRandomString(10),
        style: {
          display: "flex",
          border: "1px solid black",
          height: "50px",
          fontSize: "40px",
        },
        text: "1",
      });
    } else {
      (updatedJsonData[name] as ElementTagType[]) = [
        {
          id: generateRandomString(10),
          style: {
            display: "flex",
            border: "1px solid black",
            height: "50px",
            fontSize: "40px",
          },
          text: "2",
        },
      ];
    }
    setJson(updatedJsonData);
    // jsonToHtml(updatedJsonData, divRef.current as HTMLElement);
  });
  const removeChildElements = () => {
    const divElement = divRef.current;
    if (divElement) {
      while (divElement.firstChild) {
        divElement.removeChild(divElement.firstChild);
      }
    }
  };
  useEffect(() => {
    console.log("json", json);
    jsonToHtml(json!, divRef.current as HTMLElement);
    // return () => {
    //   removeChildElements();
    // };
  }, [json]);
  // useEffect(() => {
  //   console.log("testDat", testData);
  //   jsonToHtml(testData, divRef.current as HTMLElement);
  // }, []);

  function findObjectById(id: string, jsonObj: ElementTagType) {
    for (const key in jsonObj) {
      if (Object.hasOwnProperty.call(jsonObj, key)) {
        const items = jsonObj[key];
        for (const item of items) {
          if (item.id === id) {
            return item;
          }
        }
      }
    }
    return null; // ID에 해당하는 객체를 찾지 못한 경우
  }

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    // const newData = { ...json };
    const updatedJsonData = { ...json };
    if (ev.target instanceof Element) {
      //   console.log(ev.target.id);
      const foundObject = findObjectById(ev.target.id, updatedJsonData!);
      //   (foundObject.div = [
      //     {
      //       id: generateRandomString(10),
      //       style: {
      //         border: "1px solid blue",
      //         height: "50px",
      //         fontSize: "40px",
      //       },
      //       text: "new Div",
      //     },
      //   ]),
      //     console.log("foundOjbect", foundObject);
      // }
      // setJson(newData);
      if (foundObject["div"]) {
        (foundObject["div"] as ElementTagType[]).push({
          id: generateRandomString(10),
          style: {
            border: "1px solid black",
            height: "30px",
            width: "50px",
            fontSize: "40px",
          },
          text: "1",
        });
      } else {
        (foundObject["div"]! as ElementTagType[]) = [
          {
            id: generateRandomString(10),
            style: {
              border: "1px solid black",
              height: "30px",
              width: "50px",
              fontSize: "40px",
            },
            text: "2",
          },
        ];
      }
      console.log("foundObject", foundObject);
    }
    setJson(updatedJsonData);
  };
  return <div ref={divRef} onClick={getID} />;
}
