import { isEmpty } from "lodash";
import { useAtom } from "jotai";
import { AllHTMLAttributes, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useHandleStructure } from "../hooks";
import usePageData from "../hooks/usePageData";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { HTMLTag } from "../types";
import { generateRandomString } from "../utils/utils";
import useComponentRender from "../hooks/useComponentRender";
import { Position } from "../hooks/useRender";
import { SelectedIDAtom } from "../hooks/atom";

export default function Componentlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedComponentID, setSelectedComponentID] = useAtom(SelectedIDAtom);
  const location = useLocation();

  const currentPageName = location.pathname.split("create/")?.[1] ?? "";
  const { pageData, updatePageData: setPageData } =
    usePageData(currentPageName);

  const { parseElementsToHTML } = useComponentRender();
  const { getElementById, removeElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();

  const getSelectedElementInfo = (id: string) => {
    if (isEmpty(pageData)) return;
    const selected = getElementById(pageData, id);
    globalEmitter.emit(
      "props",
      JSON.stringify({ type: selected?.type, props: selected?.props })
    );
  };

  const handleAddElement = (elementInfo: {
    type: string;
    props: AllHTMLAttributes<keyof HTMLElementTagNameMap>;
  }) => {
    const { type, props } = elementInfo;
    // addElement(name, selectedID);
    addElement(type as keyof HTMLElementTagNameMap, props, "default");
  };

  const addElement = (
    addObjectTag: HTMLTag,
    props: object,
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
    if (selectedComponentID === "default") return;
    const newData = [...pageData];
    const updatedArray = removeElementById([...newData], selectedComponentID);
    if (updatedArray) {
      setPageData(updatedArray);
    }
    setSelectedComponentID("");
  };

  const updateElement = (key: string, updatedProps: string) => {
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, selectedComponentID);

    if (!foundObject) return;
    if (foundObject?.props) {
      foundObject.props[key] = updatedProps;
    }
    setPageData(updatedPageData);
  };

  useEffect(() => {
    if (isEmpty(pageData)) return;
    globalEmitter.on("add", handleAddElement);
    globalEmitter.on("position", handlePosition);
    globalEmitter.on("file", handleFile);
    globalEmitter.on("delete", deleteElement);
    globalEmitter.on("update_props", updateElement);

    return () => {
      globalEmitter.off("add", handleAddElement);
      globalEmitter.off("position", handlePosition);
      globalEmitter.off("file", handleFile);
      globalEmitter.off("delete", deleteElement);
      globalEmitter.off("update_props", updateElement);
    };
  }, [globalEmitter, pageData, currentPageName, selectedComponentID]);

  useEffect(() => {
    getSelectedElementInfo(selectedComponentID);
  }, [selectedComponentID]);

  const getID = () => {
    setSelectedComponentID("");
  };

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    if (isEmpty(pageData)) return;
    parseElementsToHTML(pageData, "edit");
  }, [pageData, currentPageName, selectedComponentID]);

  console.log("::pageData", pageData);
  return (
    <div
      id="init"
      onClick={() => getID()}
      style={{ height: "calc( 100vh - 50px )", width: "calc(100vw - 200px)" }}
    >
      {children}
    </div>
  );
}
