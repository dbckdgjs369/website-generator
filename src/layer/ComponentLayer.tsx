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

  const currentPageName = location.pathname.split("component/")[1] ?? "main";
  const { pageData, updatePageData: setPageData } =
    usePageData(currentPageName);

  const { parseElementsToHTML } = useRender2();
  const { getElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();
  const getSelectedElementInfo = (id: string) => {
    if (isEmpty(pageData)) return;
    const selected = getElementById(pageData, id);
    globalEmitter.emit("element_style", JSON.stringify(selected?.style));
    globalEmitter.emit("element_text", JSON.stringify(selected?.text));
  };

  const handleAddElement = (name: HTMLTag) => {
    // addElement(name, selectedID);
    addElement(name, "default");
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
        root: true,
      });
    } else {
      foundObject.inner = [
        {
          id: generateRandomString(10),
          type: addObjectTag,
          text: addObjectTag,
          root: true,
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
        break;
      }
      case "load": {
        const loadData = localStorage.getItem("pageJson");
        if (loadData) {
          const loadedData = JSON.parse(loadData);
          setPageData(loadedData);
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (isEmpty(pageData)) return;
    globalEmitter.on("add", handleAddElement);
    globalEmitter.on("position", handlePosition);
    globalEmitter.on("file", handleFile);

    getSelectedElementInfo(selectedID);
    return () => {
      globalEmitter.off("add", handleAddElement);
      globalEmitter.off("position", handlePosition);
      globalEmitter.off("file", handleFile);
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
    >
      {children}
    </div>
  );
}
