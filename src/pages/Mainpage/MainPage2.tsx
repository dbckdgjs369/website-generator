import { useEffect, useRef, useState } from "react";
import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";
import { HTMLTag } from "../../hooks/useParse";
import useMakeDOM from "../../hooks/useMakeDOM";
// import testData from "../../assets/test.json";

// import testData2 from "../../assets/test2.json";
// import { data } from "../../assets/testArray";
import useRender, { ElementStructure } from "../../hooks/useRender";
import useHandleStructure from "../../hooks/useHandleStructure";

const DEFAULT_STYLE = {
  display: "flex",
  border: "1px solid black",
  width: "100%",
  fontSize: "30px",
};

// const DEFAULT_STRUCTURE: ElementStructure = {
//   id: "1",
//   type: "div",
//   text: "dummy",
//   style: {
//     height: "10px",
//     width: "500px",
//     border: "1px solid",
//   },
// };

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

  useEffect(() => {
    globalEmitter.on("click", handleAddElement);

    console.log("click");
    return () => {
      globalEmitter.off("click", handleAddElement);
    };
  }, [pageData, selectedID]);

  const getID = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ev.target instanceof Element) {
      if (ev.target.id === "init") {
        setSelectedID("first");
      } else {
        console.log(":::::::::ev", ev.target.id);
        setSelectedID(ev.target.id);
      }
    }
  };

  useEffect(() => {
    console.log("here", pageData);
    // 바뀐 json을 렌더해주는 부분
    parseElementsToHTML(pageData);
  }, [pageData]);

  return (
    <div id="init" ref={divRef} onClick={getID} style={{ height: "100vh" }}>
      <button onClick={() => setPageData([])}>reset</button>
    </div>
  );
}
