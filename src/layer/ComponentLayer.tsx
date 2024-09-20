import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useHandleStructure } from "../hooks";
import usePageData from "../hooks/usePageData";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { HTMLTag } from "../types";
import { generateRandomString } from "../utils/utils";
import useRender2 from "../hooks/useRender2";
// import { createRoot } from "react-dom/client";
// import DraggableComponent from "../components/DraggableComponent";

export default function Componentlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedID, setSelectedID] = useState("default");
  const location = useLocation();

  const currentPageName = location.pathname.split("component/")[1] ?? "main";
  const {
    pageData,
    updatePageData: setPageData,
    pageList,
  } = usePageData(currentPageName);
  console.log(":pageData", pageData);

  const { parseElementsToHTML } = useRender2();
  const { getElementById, removeElementById } = useHandleStructure();
  const globalEmitter = useGlobalEventEmitter();
  const getSelectedElementInfo = (id: string) => {
    if (isEmpty(pageData)) return;
    const selected = getElementById(pageData, id);
    globalEmitter.emit("element_style", JSON.stringify(selected?.style));
    globalEmitter.emit("element_text", JSON.stringify(selected?.text));
  };

  const handleAddElement = (name: HTMLTag) => {
    addElement(name, "default");
  };
  const handleAddComponent = (name: string) => {
    addComponent(name, selectedID);
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

  console.log("::pageList", pageList);
  const addComponent = (componentName: string, targetObjectID: string) => {
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(pageData, targetObjectID);
    const [component] = pageList[componentName];
    if (!component.inner) return;
    const [inner] = component.inner;
    if (!foundObject) return;
    if (foundObject.inner) {
      foundObject.inner.push({ ...inner, id: generateRandomString(10) });
    } else {
      foundObject.inner = [{ ...inner, id: generateRandomString(10) }];
    }
    setPageData(updatedPageData);
  };
  // const createDraggableElement = () => {
  //   // 새로운 div 요소 생성
  //   const newElement = document.createElement("div");
  //   newElement.style.position = "absolute"; // 필수적인 스타일 설정
  //   // newElement.style.top = "100px"; // 초기 위치 설정
  //   // newElement.style.left = "100px"; // 초기 위치 설정

  //   // 생성된 div를 body에 추가
  //   document.body.appendChild(newElement);

  //   // React 컴포넌트를 새로 생성된 div에 렌더링
  //   const root = createRoot(newElement);
  //   root.render(
  //     <DraggableComponent id={generateRandomString(10)}>
  //       <div
  //         style={{
  //           width: "100px",
  //           height: "100px",
  //           borderRadius: "100%",
  //           background: "red",
  //         }}
  //       >
  //         hello
  //       </div>
  //     </DraggableComponent>
  //   );
  // };
  const addElement = (addObjectTag: HTMLTag, targetObjectID: string) => {
    console.log(":::addObject", addObjectTag, targetObjectID);
    // id를 가진 요소에 object Tag를 추가해줌
    if (isEmpty(pageData)) return;
    const updatedPageData = [...pageData];
    const foundObject = getElementById(updatedPageData, targetObjectID);
    if (!foundObject) return;
    if (foundObject.inner) {
      foundObject.inner.push({
        id: generateRandomString(10),
        type: addObjectTag,
        // style: DEFAULT_STYLE,
        // text: addObjectTag,
        root: true,
      });
      // foundObject.root = true;
    } else {
      foundObject.inner = [
        {
          id: generateRandomString(10),
          type: addObjectTag,
          // style: DEFAULT_STYLE,
          text: addObjectTag,
          root: true,
        },
      ];
    }
    setPageData(updatedPageData);
  };
  console.log("pageData", pageData);

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
    globalEmitter.on("add", handleAddElement);
    globalEmitter.on("component", handleAddComponent);
    globalEmitter.on("style", handleAddStyle);
    globalEmitter.on("text", handleAddText);
    globalEmitter.on("file", handleFile);
    globalEmitter.on("delete", deleteElement);
    getSelectedElementInfo(selectedID);
    return () => {
      globalEmitter.off("add", handleAddElement);
      globalEmitter.off("component", handleAddComponent);
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