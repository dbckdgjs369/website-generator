import { ElementStructure } from "../hooks/useRender";

export const data: ElementStructure[] = [
  {
    type: "div",
    id: "a",
    style: {
      border: "1px solid black",
    },
    inner: [
      {
        type: "div",
        id: "a",
        inner: [
          {
            id: "aa",
            type: "article",
            text: "article",
          },
        ],
      },
    ],
  },
  {
    type: "button",
    id: "b",
    text: "button",
  },
];
