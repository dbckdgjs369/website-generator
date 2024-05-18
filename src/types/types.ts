import { CSSProperties } from "react";

type HTMLTag = keyof HTMLElementTagNameMap;
type StringKeyStringValueObject = {
  [key: string]: string | { [key: string]: string };
};

type ElementTagType = {
  style?: CSSProperties | StringKeyStringValueObject; //@TODO 추후에 style 넣을 때 kebab으로 바꿔서 넣어줘야할 듯
  text?: string;
  id?: string;
} & {
  [key in HTMLTag]?: key extends "style"
    ? CSSProperties
    : key extends "text" & "id"
    ? string
    : ElementTagType[];
};

export type { HTMLTag, ElementTagType };
