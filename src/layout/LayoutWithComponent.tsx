import { PropsWithChildren } from "react";
import { Row } from "groot-component-library";

import * as S from "./emotion";
import Header from "./Header";
import ToolBarWithComponent from "../components/ToolBar/ToolBarWithComponent";
import ComponentLayer from "../layer/ComponentLayer";

export default function LayoutWithComponent({ children }: PropsWithChildren) {
  return (
    <S.Wrapper>
      <Header />
      <Row>
        <ComponentLayer>
          <S.MainView>{children}</S.MainView>
        </ComponentLayer>
        <S.ToolBaWrapper>
          <ToolBarWithComponent />
        </S.ToolBaWrapper>
      </Row>
    </S.Wrapper>
  );
}
