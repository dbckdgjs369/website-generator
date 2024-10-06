/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useHandleStructure } from "../hooks";
import usePageData from "../hooks/usePageData";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { HTMLTag } from "../types";
import { generateRandomString } from "../utils/utils";
import useRender2 from "../hooks/useRender2";
import { Position } from "../hooks/useRender";

export default function Componentlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedID, setSelectedID] = useState("default");
  const location = useLocation();

  const currentPageName = location.pathname.split("component/")?.[1] ?? "test";
  const { pageData, updatePageData: setPageData } =
    usePageData(currentPageName);

  const { parseElementsToHTML } = useRender2();
  const { getElementById, removeElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();
  const getSelectedElementInfo = (id: string) => {
    if (isEmpty(pageData)) return;
    const selected = getElementById(pageData, id);
    globalEmitter.emit("element_style", JSON.stringify(selected?.style));
    globalEmitter.emit("element_text", JSON.stringify(selected?.text));
    globalEmitter.emit("props", JSON.stringify(selected?.props));
  };

  const handleAddElement = (elementInfo: { type: string; props: any }) => {
    const { type, props } = elementInfo;
    // addElement(name, selectedID);
    addElement(type as keyof HTMLElementTagNameMap, props, "default");
  };

  const addElement = (
    addObjectTag: HTMLTag,
    props: any,
    targetObjectID: string
  ) => {
    // id를 가진 요소에 object Tag를 추가해줌
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, targetObjectID);
    if (!foundObject) return;
    if (foundObject.inner) {
      foundObject.inner.push({
        id: generateRandomString(10),
        type: addObjectTag,
        root: true,
        props: { ...props },
      });
    } else {
      foundObject.inner = [
        {
          id: generateRandomString(10),
          type: addObjectTag,
          text: addObjectTag,
          root: true,
          props: { ...props },
        },
      ];
    }
    setPageData(updatedPageData);
  };

  const handlePosition = (pos: Position, id: string) => {
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, id);
    if (pos) {
      const e = document.getElementById(id);
      if (e) {
        e.style["transform"] = `translate(${pos.x}px,${pos.y}px)`;
      }
    }
    if (!foundObject) return;
    foundObject.position = pos;

    setPageData(updatedPageData);
  };
  const handleFile = (name: string) => {
    switch (name) {
      case "save": {
        localStorage.setItem("pageJson", JSON.stringify(pageData));
        alert("저장에 성공했습니다!");
        break;
      }
      case "load": {
        const loadData = localStorage.getItem("pageJson");
        if (loadData) {
          const loadedData = JSON.parse(loadData);
          setPageData(loadedData);
        }
        alert("페이지를 불러왔습니다.");
        break;
      }
    }
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

  const updateElement = (key: string, updatedProps: string) => {
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, selectedID);

    if (!foundObject) return;
    if (foundObject?.props) {
      foundObject.props[key] = updatedProps; //여기부터 key에 넣어야돼
    }
    setPageData(updatedPageData);
  };

  useEffect(() => {
    if (isEmpty(pageData)) return;
    globalEmitter.on("add", handleAddElement);
    globalEmitter.on("position", handlePosition);
    globalEmitter.on("file", handleFile);
    globalEmitter.on("id", setSelectedID);
    globalEmitter.on("delete", deleteElement);
    globalEmitter.on("update_props", updateElement);

    getSelectedElementInfo(selectedID);
    return () => {
      globalEmitter.off("add", handleAddElement);
      globalEmitter.off("position", handlePosition);
      globalEmitter.off("file", handleFile);
      globalEmitter.off("id", setSelectedID);
      globalEmitter.off("delete", deleteElement);
      globalEmitter.off("update_props", updateElement);
    };
  }, [globalEmitter, selectedID, pageData, currentPageName]);

  const getID = (ev?: React.MouseEvent<HTMLDivElement>) => {
    if (ev?.target instanceof Element) {
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

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    if (isEmpty(pageData)) return;
    parseElementsToHTML(pageData, "edit");
  }, [pageData, currentPageName]);

  console.log("::pageData", pageData);
  return (
    <div id="init" onClick={getID} style={{ height: "100vh", width: "100vw" }}>
      {children}
    </div>
  );
}
