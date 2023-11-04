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
      },
    ],
  },
  {
    type: "button",
    id: "b",
    text: "button",
  },
];
