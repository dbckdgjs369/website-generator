import { PropsWithChildren } from "react";

import * as S from "./emotion";
import ToolBar from "../components/ToolBar/ToolBar";
import Provider from "../Provider";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <S.Wrapper>
      <Provider>
        <S.MainView>{children}</S.MainView>
      </Provider>
      <S.ToolBaWrapper>
        <ToolBar />
      </S.ToolBaWrapper>
    </S.Wrapper>
  );
}
