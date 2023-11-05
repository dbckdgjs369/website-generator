import { useEffect, useRef, useState } from "react";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { ElementTagType, HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";
// import testData from "../../assets/test.json";

// import testData2 from "../../assets/test2.json";
import { data } from "../../assets/testArray";
import useRender, { ElementStructure } from "../../hooks/useRender";
import useHandleStructure from "../../hooks/useHandleStructure";

const DEFAULT_STYLE = {
  display: "flex",
  border: "1px solid black",
  width: "100%",
  fontSize: "30px",
};

const DEFAULT_STRUCTURE: ElementStructure = {
  id: "1",
  type: "div",
  text: "dummy",
  style: {
    height: "10px",
    width: "500px",
    border: "1px solid",
  },
};

export default function MainPage2() {
  const [selectedID, setSelectedID] = useState("init");
  const [pageData, setPageData] = useState<ElementStructure[]>([
    {
      id: "init",
      type: "div",
      style: {
        ...DEFAULT_STYLE,
      },
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
  const addElement = (addObjectTag: HTMLTag, targetObjectID: string) => {
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

  function findAndAddButton(arr: ElementStructure[]): void {
    for (const obj of arr) {
      if (obj.id === "1") {
        if (!obj.inner) {
          obj.inner = [];
        }
        obj.inner.push({
          type: "button",
          id: generateRandomString(10),
          text: "button",
        });
        return;
      } else if (obj.inner) {
        findAndAddButton(obj.inner);
      }
    }
  }
  useEffect(() => {
    globalEmitter.on("click", handleAddElement);
    return () => {
      globalEmitter.off("click", handleAddElement);
    };
  }, [pageData, selectedID]);

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      setSelectedID(ev.target.id);
    }
  };
  useEffect(() => {
    console.log("here");
    // 바뀐 json을 렌더해주는 부분
    // jsonToHtml(json!, divRef.current as HTMLElement);
    // jsonToHtml(testData2, divRef.current as HTMLElement);
    console.log("pageData", pageData);
    console.log("getgetElementById", getElementById(data, "aa"));
    parseElementsToHTML(pageData);
  }, [pageData, parseElementsToHTML]);

  return (
    <div id="init" ref={divRef} onClick={getID} style={{ height: "100vh" }}>
      <button onClick={() => findAndAddButton(data)}>Add</button>
    </div>
  );
}
