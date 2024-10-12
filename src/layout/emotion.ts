import styled from "@emotion/styled";
import { Column, Row } from "groot-component-library";

export const Wrapper = styled(Column)`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export const MainView = styled.div`
  width: 85%;
`;

export const ToolBaWrapper = styled.div`
  width: 20%;
`;

export const Header = styled(Row)`
  height: 50px;
  width: 100%;
  border: 1px solid #ddd;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  box-sizing: border-box;
`;
