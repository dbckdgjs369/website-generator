/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from "@emotion/styled";
import { Typography } from "groot-component-library";

export type NavigationBarType = {
  text: string;
  href?: string;
};

export default function NavigationBar({
  text = "Algorithm",
  href,
}: NavigationBarType) {
  return (
    //@ts-ignore
    <StyledLink tag="a" typoSize="h4" href={href}>
      {text}
    </StyledLink>
  );
}

export const StyledLink = styled(Typography)`
  color: gray;
  &:hover {
    color: rgb(75, 74, 74);
  }
  cursor: pointer;
`;
