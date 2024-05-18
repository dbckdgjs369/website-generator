import { useEffect, useState } from "react";

import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import useRender, { ElementStructure } from "../../hooks/useRender";
import useHandleStructure from "../../hooks/useHandleStructure";
import { generateRandomString } from "../../utils/utils";
import { HTMLTag } from "../../types";

const DEFAULT_STYLE = {
  display: "flex",
  border: "1px solid black",
  width: "100%",
  fontSize: "30px",
  minHeight: "40px",
};

export default function EditorPage() {
  const [selectedID, setSelectedID] = useState("default");
  const [pageData, setPageData] = useState<ElementStructure[]>([
    {
      id: "default",
      type: "div",
      style: {
        width: "100%",
        height: "100%",
      },
    },
  ]);
  const { parseElementsToHTML } = useRender();
  const { getElementById, removeElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();
  const getSelectedElementInfo = (id: string) => {
    const selected = getElementById(pageData, id);
    globalEmitter.emit("element_style", JSON.stringify(selected?.style));
    globalEmitter.emit("element_text", JSON.stringify(selected?.text));
  };
  const handleAddElement = (name: HTMLTag) => {
    addElement(name, selectedID);
  };

  const handleAddStyle = (styleFromToolBar: string) => {
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, selectedID);
    if (!foundObject) return;
    const newStyleObject: { [key: string]: string } = {};
    const styleArr = styleFromToolBar.replace(/\r?\n|\r/g, "").split(";");
    styleArr.forEach((style: string) => {
      if (style.length === 0) return;
      const row = style.split(":");
      newStyleObject[row[0]] = row[1];
    });

    foundObject.style = { ...newStyleObject };
    globalEmitter.emit("element_style", JSON.stringify({ ...newStyleObject }));

    setPageData(updatedPageData);
  };

  const handleAddText = (text: string) => {
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, selectedID);
    if (!foundObject) return;
    foundObject.text = text;
    setPageData(updatedPageData);
  };

  const deleteElement = () => {
    const newData = [...pageData];
    const updatedArray = removeElementById([...newData], selectedID);
    if (updatedArray) {
      setPageData(updatedArray);
    }
    setSelectedID("default");
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
        text: addObjectTag,
      });
    } else {
      foundObject.inner = [
        {
          id: generateRandomString(10),
          type: addObjectTag,
          style: DEFAULT_STYLE,
          text: addObjectTag,
        },
      ];
    }
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
            id: "default",
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
    globalEmitter.on("text", handleAddText);
    globalEmitter.on("file", handleFile);
    globalEmitter.on("delete", deleteElement);
    getSelectedElementInfo(selectedID);
    return () => {
      globalEmitter.off("click", handleAddElement);
      globalEmitter.off("style", handleAddStyle);
      globalEmitter.off("file", handleFile);
      globalEmitter.off("delete", deleteElement);
      globalEmitter.off("text", handleAddText);
    };
  }, [pageData, selectedID]);

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      if (ev.target.id === "init") {
        setSelectedID("default");
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
  const drop = (ev: React.DragEvent<HTMLElement>) => {
    const newData = [...pageData];

    const x = ev.clientX;
    const y = ev.clientY;

    const dragTarget = ev.target as HTMLElement;
    const dropTarget = document.elementFromPoint(x, y);
    const dragObj = getElementById(newData, dragTarget.id);
    const updatedArray = removeElementById([...newData], dragTarget.id);
    const dropObj = getElementById(updatedArray, dropTarget?.id || "");
    if (!dropObj) return;
    if (!dragObj) return;
    if (dropObj.inner) {
      dropObj.inner.push({ ...dragObj });
    } else {
      dropObj.inner = [
        {
          ...dragObj,
        },
      ];
    }
    if (updatedArray) {
      setPageData(updatedArray);
    }
  };

  return (
    <div
      id="init"
      onClick={getID}
      style={{ height: "100vh" }}
      draggable={true}
      onDragEnd={drop}
    >
      <button onClick={() => setPageData([])}>reset</button>
    </div>
  );
}
