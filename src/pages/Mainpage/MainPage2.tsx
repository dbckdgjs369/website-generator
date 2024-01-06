/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";
import useRender, { ElementStructure } from "../../hooks/useRender";
import useHandleStructure from "../../hooks/useHandleStructure";

const DEFAULT_STYLE = {
  display: "flex",
  border: "1px solid black",
  width: "100%",
  fontSize: "30px",
};

export default function MainPage2() {
  const [selectedID, setSelectedID] = useState("first");
  const [pageData, setPageData] = useState<ElementStructure[]>([
    {
      id: "first",
      type: "div",
    },
  ]);
  const { parseElementsToHTML } = useRender();
  const { getElementById, removeElementById } = useHandleStructure();
  const divRef = useRef<HTMLDivElement>(null);
  const globalEmitter = useGlobalEventEmitter();
  const { generateRandomString } = useMakeDOM();
  const getStyleFromSelectedElement = (id: string) => {
    const selected = getElementById(pageData, id);
    globalEmitter.emit("client_style", JSON.stringify(selected?.style));
  };
  const handleAddElement = (name: HTMLTag) => {
    addElement(name, selectedID);
  };

  const handleAddStyle = (style: any) => {
    addStyle(selectedID, style);
  };

  const deleteElement = (data: any) => {
    // console.log("data", data);
    // for (const key in data) {
    //   if (data[key] !== null && typeof data[key] === "object") {
    //     if (data[key].id === selectedID) {
    //       delete data[key];
    //       return; // 원하는 객체를 찾았으면 함수를 종료합니다.
    //     } else {
    //       deleteElement(data[key]); // 재귀적으로 탐색합니다.
    //     }
    //   }
    // }
    // console.log(data);
    const a = removeElementById(pageData, data, selectedID);
    if (a) {
      setPageData(a);
    }
  };

  const addStyle = (targetObjectID: string, newStyle: any) => {
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, targetObjectID);
    if (!foundObject) return;
    const newStyleObject = {};
    const styleArr = newStyle.replace(/\r?\n|\r/g, "").split(";");
    styleArr.forEach((style: string) => {
      if (style.length === 0) return;
      const row = style.split(":");
      //@ts-ignore
      newStyleObject[row[0]] = row[1];
    });
    if (foundObject.style) {
      foundObject.style = { ...foundObject.style, ...newStyleObject };
    } else {
      foundObject.style = { ...newStyleObject };
    }
    setPageData(updatedPageData);
  };
  const addElement = (addObjectTag: HTMLTag, targetObjectID: string) => {
    // id를 가진 요소에 object Tag를 추가해줌
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, targetObjectID);
    if (!foundObject) return;
    if (foundObject.inner) {
      foundObject.inner.push({
        id: generateRandomString(10),
        type: addObjectTag,
        style: DEFAULT_STYLE,
        text: "asdgasg",
      });
    } else {
      foundObject.inner = [
        {
          id: generateRandomString(10),
          type: addObjectTag,
          style: DEFAULT_STYLE,
          text: "asdg",
        },
      ];
    }
    console.log("update", updatedPageData);
    setPageData(updatedPageData);
  };
  const handleFile = (name: string) => {
    switch (name) {
      case "save": {
        localStorage.setItem("pageJson", JSON.stringify(pageData));
        break;
      }
      case "load": {
        const loadData = localStorage.getItem("pageJson");
        if (loadData) {
          setPageData(JSON.parse(loadData));
        }
        break;
      }
      case "clear": {
        setPageData([
          {
            id: "first",
            type: "div",
          },
        ]);
        localStorage.clear();
      }
    }
  };

  useEffect(() => {
    globalEmitter.on("click", handleAddElement);
    globalEmitter.on("style", handleAddStyle);
    globalEmitter.on("file", handleFile);
    globalEmitter.on("delete", () => deleteElement(pageData));
    getStyleFromSelectedElement(selectedID);
    return () => {
      globalEmitter.off("click", handleAddElement);
      globalEmitter.off("style", handleAddStyle);
      globalEmitter.off("file", handleFile);
      globalEmitter.off("delete", deleteElement);
    };
  }, [pageData, selectedID]);

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      if (ev.target.id === "init") {
        setSelectedID("first");
      } else {
        const id = ev.target.id;
        const prevElement = document.getElementById(selectedID); // 만약에 점선 유지시키고 싶으면 json에 넣어서 이거 사용해야 됌
        const selectedElement = document.getElementById(id);
        if (!prevElement) return;
        if (!selectedElement) return;
        prevElement?.removeAttribute("class");
        selectedElement?.setAttribute("class", "selected");
        setSelectedID(id);
      }
    }
  };

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    parseElementsToHTML(pageData);
  }, [pageData]);

  return (
    <div id="init" ref={divRef} onClick={getID} style={{ height: "100vh" }}>
      <button onClick={() => setPageData([])}>reset</button>
    </div>
  );
}
