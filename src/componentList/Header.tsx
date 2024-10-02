import { Typography } from "groot-component-library";

export type HeaderType = {
  title: string;
  color?: string;
};

export default function Header({ title, color }: HeaderType) {
  return (
    <Typography
      tag="div"
      typoSize="h2"
      style={{ color: color, whiteSpace: "nowrap" }}
    >
      {title}
    </Typography>
  );
}
