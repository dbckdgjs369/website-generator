/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
// import useTemp from "../../hooks/useTemp";
import usePageHandler from "../../hooks/usePageHandler";
import { useRender } from "../../hooks";
import {
  ComponentListType,
  ElementStructure,
  PageListType,
} from "../../hooks/atom";
// const PAGE_DATA: PageListType = new Map([
//   [
//     "main",
//     new Map([
//       [
//         "root",
//         {
//           id: "title",
//           type: "h2",
//           text: "h",
//         },
//       ],
//       [
//         "root1",
//         {
//           id: "title",
//           type: "h2",
//           text: "h",
//           inner: new Map([
//             [
//               "wrapper",
//               {
//                 id: "a",
//                 type: "h2",
//                 text: "h3",
//               },
//             ],
//             [
//               "wrapper",
//               {
//                 id: "a",
//                 type: "h2",
//                 text: "h3",
//               },
//             ],
//           ]),
//         },
//       ],
//       [
//         "root2",
//         {
//           id: "title",
//           type: "h2",
//           text: "h",
//         },
//       ],
//     ]),
//   ],
// ]);

const PAGE_DATA: ComponentListType = new Map([
  [
    "root",
    {
      id: "title",
      type: "div",
      text: "div1",
      // style: { border: "1px solid" },
    },
  ],
  [
    "root1",
    {
      id: "title",
      type: "div",
      text: "div2",
      // style: { border: "1px solid" },
      inner: new Map([
        [
          "wrapper1",
          {
            id: "wrapper1",
            type: "div",
            text: "div3",
            // style: { border: "1px solid" },
          },
        ],
        [
          "wrapper2",
          {
            id: "wrapper2",
            type: "h1",
            text: "h1",
            style: { border: "1px solid" },
          },
        ],
      ]),
    },
  ],
  [
    "root2",
    {
      id: "title",
      type: "h2",
      text: "h2",
      style: {},
    },
  ],
]);
export default function TestPage() {
  // const { component } = useTemp({ pageID: "", componentID: "" });
  const { useAddPage } = usePageHandler();
  const { parseElementsToHTML } = useRender();
  const addPage = useAddPage();

  useEffect(() => {
    // 바뀐 json을 렌더해주는 부분
    parseElementsToHTML(PAGE_DATA);
  }, []);
  return (
    <div
      id="init"
      style={{ height: "100vh", width: "100vw" }}
      draggable={false}
    >
      <div>
        <button onClick={() => addPage("test", new Map())}>addPage</button>
        <button onClick={() => addPage("test1", new Map())}>addPage</button>
        <button onClick={() => addPage("test2", new Map())}>addPage</button>
        <button onClick={() => addPage("test3", new Map())}>addPage</button>
      </div>
    </div>
  );
}
