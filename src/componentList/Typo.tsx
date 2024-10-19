/* eslint-disable react-refresh/only-export-components */

import { Typography } from "groot-component-library";

export const ALL_TYPO_TYPE_LIST = [
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body1",
  "body2",
  "subtitle1",
  "subtitle2",
] as const;

type TypographTypoList = typeof ALL_TYPO_TYPE_LIST;
type TypographTypoType = TypographTypoList[number];

export type TypoType = {
  text: string;
  typoSize?: TypographTypoType;
  color?: string;
};

export default function Typo({
  text,
  typoSize = "span",
  color = "black",
}: TypoType) {
  return (
    <Typography
      typoSize={typoSize}
      style={{ color: color, whiteSpace: "nowrap" }}
    >
      {text}
    </Typography>
  );
}
