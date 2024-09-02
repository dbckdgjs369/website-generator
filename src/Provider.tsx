import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import useRender from "./hooks/useRender";
import { useHandleStructure } from "./hooks";
import { useGlobalEventEmitter } from "./provider/GlobalEventProvider/GlobalEventEmitterContext";
import { HTMLTag } from "./types";
import { generateRandomString } from "./utils/utils";
import usePageData from "./hooks/usePageData";

const DEFAULT_STYLE = {
  display: "flex",
  border: "1px solid black",
  width: "100%",
  fontSize: "30px",
  height: "40px",
};

export default function Provider({ children }: { children: React.ReactNode }) {
  const [selectedID, setSelectedID] = useState("default");
  const location = useLocation();

  const currentPageName = location.pathname.replace("/", "") ?? "main";
  const { pageData, updatePageData: setPageData } =
    usePageData(currentPageName);
  const { parseElementsToHTML } = useRender();
  const { getElementById, removeElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();
  const getSelectedElementInfo = (id: string) => {
    if (isEmpty(pageData)) return;
    const selected = getElementById(pageData, id);
    globalEmitter.emit("element_style", JSON.stringify(selected?.style));
    globalEmitter.emit("element_text", JSON.stringify(selected?.text));
  };

  const handleAddElement = (name: HTMLTag) => {
    addElement(name, selectedID);
  };

  const handleAddStyle = (styleFromToolBar: string) => {
    if (isEmpty(pageData)) return;
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
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, selectedID);
    if (!foundObject) return;
    foundObject.text = text;
    setPageData(updatedPageData);
  };

  const deleteElement = () => {
    if (isEmpty(pageData)) return;
    if (selectedID === "default") return;
    const newData = [...pageData];
    const updatedArray = removeElementById([...newData], selectedID);
    if (updatedArray) {
      setPageData(updatedArray);
    }
    setSelectedID("default");
  };

  const addElement = (addObjectTag: HTMLTag, targetObjectID: string) => {
    // id를 가진 요소에 object Tag를 추가해줌
    if (isEmpty(pageData)) return;
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
      // case "load": {
      //   const loadData = localStorage.getItem("pageJson");
      //   if (loadData) {
      //     setPageData({
      //       pageName: currentPageName,
      //       data: JSON.parse(loadData),
      //     });
      //   }
      //   break;
      // }
      // case "clear": {
      //   setPageData({
      //     pageName: currentPageName,
      //     data: [
      //       {
      //         id: "default",
      //         type: "div",
      //       },
      //     ],
      //   });
      //   localStorage.clear();
      //   break;
      // }
      case "component": {
        // setPageData({
        //   pageName: currentPageName,
        //   data: [
        //     {
        //       id: "component",
        //       type: "div",
        //       text: "hello",
        //     },
        //   ],
        // });
        // addElement("div", selectedID);
        // localStorage.setItem("component", JSON.stringify(pageData));
        break;
      }
    }
  };

  useEffect(() => {
    if (isEmpty(pageData)) return;
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
  }, [globalEmitter, selectedID, pageData, currentPageName]);

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      const id = ev.target.id;
      if (id === "init") {
        setSelectedID("default");
      } else {
        setSelectedID(id);
      }
      const prevElement = document.getElementById(
        selectedID === "default" ? "init" : selectedID
      );
      const selectedElement = document.getElementById(id);
      if (!prevElement) return;
      if (!selectedElement) return;
      prevElement?.removeAttribute("class");
      selectedElement?.setAttribute("class", "selected");
    }
  };
  const drop = (ev: React.DragEvent<HTMLElement>) => {
    if (isEmpty(pageData)) return;

    const newData = [...pageData];
    const x = ev.clientX;
    const y = ev.clientY;

    const dragTarget = ev.target as HTMLElement;
    const dropTarget = document.elementFromPoint(x, y);
    const dragObj = getElementById(newData, dragTarget.id);
    if (selectedID === dragTarget.id) return;
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

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    if (isEmpty(pageData)) return;
    parseElementsToHTML(pageData);
  }, [pageData, currentPageName]);

  return (
    <div
      id="init"
      onClick={getID}
      style={{ height: "100vh", width: "100vw" }}
      draggable={false}
      onDragEnd={drop}
    >
      {children}
    </div>
  );
}
