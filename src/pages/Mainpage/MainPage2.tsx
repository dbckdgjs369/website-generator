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
  const { getElementById } = useHandleStructure();
  const divRef = useRef<HTMLDivElement>(null);
  const globalEmitter = useGlobalEventEmitter();
  const { generateRandomString } = useMakeDOM();
  const handleAddElement = (name: HTMLTag) => {
    addElement(name, selectedID);
  };

  const handleAddStyle = (style: any) => {
    addStyle(selectedID, style);
  };

  const addStyle = (targetObjectID: string, newStyle: any) => {
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, targetObjectID);
    if (!foundObject) return;
    const newStyleObject = {};
    const styleArr = newStyle.split(";"); // TODO 줄바꿈 없애는 처리 필요(Enter 넣어도 받을 수 ㅇ씨게)
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
    console.log("here::", name);
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

    console.log("click");
    return () => {
      globalEmitter.off("click", handleAddElement);
      globalEmitter.off("style", handleAddStyle);
      globalEmitter.off("file", handleFile);
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
