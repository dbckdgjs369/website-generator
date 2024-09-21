import { PropsWithChildren } from "react";

import * as S from "./emotion";
import ToolBarWithComponent from "../components/ToolBar/ToolBarWithComponent";
import ComponentLayer from "../layer/ComponentLayer";

export default function LayoutWithComponent({ children }: PropsWithChildren) {
  return (
    <S.Wrapper>
      <ComponentLayer>
        <S.MainView>{children}</S.MainView>
      </ComponentLayer>
      <S.ToolBaWrapper>
        <ToolBarWithComponent />
      </S.ToolBaWrapper>
    </S.Wrapper>
  );
}
