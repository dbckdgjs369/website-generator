/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import testData from "../../assets/test.json";
import useRender, { ElementStructure } from "../../hooks/useRender";
export default function TestPage() {
  const { parseElementsToHTML } = useRender();
  useEffect(() => {
    console.log("::::::test", testData);
    // 바뀐 json을 렌더해주는 부분
    //@ts-ignore
    parseElementsToHTML(testData as ElementStructure[]);
  }, [testData]);
  return (
    <div id="init" style={{ height: "100vh" }}>
      test
    </div>
  );
}
