/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Position, SelectedIDAtom } from "../hooks/atom";
import usePageHandler from "../hooks/usePageHandler";

export default function Componentlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedComponentID, setSelectedComponentID] = useAtom(SelectedIDAtom);
  const location = useLocation();

  const currentPageName = location.pathname.split("create/")?.[1] ?? "";
  const {
    pageList: pageData,
    addComponent,
    addPage,
    deleteComponent,
    deletePage,
    updateComponent,
    addComponentToPage,
  } = usePageHandler();
  const currentPageData = pageData.get(currentPageName);

  const { parseElementsToHTML } = useComponentRender();
  const { getElementById, removeElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();

  const getSelectedElementInfo = (id: string) => {
    if (isEmpty(pageData)) return;
    const selected = getElementById(pageData.get(currentPageName ?? "")!, id);
    globalEmitter.emit(
      "props",
      JSON.stringify({ type: selected?.type, props: selected?.props })
    );
  };
  console.log("elementInfo");
  const handleAddElement = (elementInfo: {
    type: string;
    props: AllHTMLAttributes<keyof HTMLElementTagNameMap>;
  }) => {
    const { type, props } = elementInfo;
    console.log(";::elementInfo", elementInfo);
    // addElement(name, selectedID);
    addElement(type as keyof HTMLElementTagNameMap);
  };
  console.log("pageData", pageData);
  const addElement = (addObjectTag: HTMLTag) => {
    // id를 가진 요소에 object Tag를 추가해줌
    addComponentToPage(
      currentPageName,
      new Map([
        [
          generateRandomString(10),
          {
            id: generateRandomString(10),
            type: addObjectTag,
            text: addObjectTag,
          },
        ],
      ])
    );
  };

  // const handlePosition = (pos: Position, id: string) => {
  //   if (isEmpty(pageData)) return;
  //   const updatedPageData = [...pageData];
  //   const foundObject = getElementById(updatedPageData, id);
  //   if (pos) {
  //     const e = document.getElementById(id);
  //     if (e) {
  //       e.style["transform"] = `translate(${pos.x}px,${pos.y}px)`;
  //     }
  //   }
  //   if (!foundObject) return;
  //   foundObject.position = pos;

  //   setPageData(updatedPageData);
  // };

  const handlePosition = (pos: Position, id: string) => {
    updateComponent(currentPageName, id, { position: pos });
  };
  const handleFile = (name: string) => {
    switch (name) {
      case "save": {
        localStorage.setItem("pageJson", JSON.stringify(pageData));
        alert("저장에 성공했습니다!");
        break;
      }
      // case "load": {
      //   const loadData = localStorage.getItem("pageJson");
      //   if (loadData) {
      //     const loadedData = JSON.parse(loadData);
      //     setPageData(loadedData);
      //   }
      //   alert("페이지를 불러왔습니다.");
      //   break;
      // }
    }
  };

  // const deleteElement = () => {
  //   if (isEmpty(pageData)) return;
  //   if (selectedComponentID === "default") return;
  //   const newData = [...pageData];
  //   const updatedArray = removeElementById([...newData], selectedComponentID);
  //   if (updatedArray) {
  //     setPageData(updatedArray);
  //   }
  //   setSelectedComponentID("");
  // };
  const deleteElement = () => {
    if (isEmpty(pageData)) return;
    if (selectedComponentID === "default") return;
    deleteComponent(currentPageName, selectedComponentID);
    setSelectedComponentID("");
  };

  const updateElement = (key: string, updatedProps: string) => {
    if (isEmpty(pageData)) return;
    // const updatedPageData = [...pageData];
    // const foundObject = getElementById(updatedPageData, selectedComponentID);

    // if (!foundObject) return;
    // if (foundObject?.props) {
    //   foundObject.props[key] = updatedProps;
    // }
    // setPageData(updatedPageData);
  };

  useEffect(() => {
    // if (isEmpty(pageData)) return;
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
    if (!currentPageData) return;
    parseElementsToHTML(currentPageData, "edit");
  }, [currentPageData, currentPageName]);

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
