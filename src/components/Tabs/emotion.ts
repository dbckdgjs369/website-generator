import styled from "@emotion/styled";
import { Button, Column } from "groot-component-library";
import { Link } from "react-router-dom";

export const StyledButton = styled(Button)`
  width: 100%;
`;

export const CurrentStatusWrapper = styled(Column)`
  gap: 20px;
`;

export const StyledLink = styled(Link)`
  color: black;
  /* text-decoration: none; */
`;
