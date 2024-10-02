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

export default function Test({
  text,
  typoSize,
}: {
  text: string;
  typoSize: TypographTypoType;
}) {
  return <Typography typoSize={typoSize}>{text}</Typography>;
}
