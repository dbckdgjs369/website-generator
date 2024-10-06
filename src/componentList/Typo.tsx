import { Typography } from "groot-component-library";

type TypographTypoType =
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "subtitle1"
  | "subtitle2";

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
    <Typography typoSize={typoSize} style={{ color: color }}>
      {text}
    </Typography>
  );
}
