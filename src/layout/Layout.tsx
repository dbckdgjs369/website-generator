import { PropsWithChildren } from "react";
import * as S from "./emotion";
import ToolBar from "../components/ToolBar/ToolBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <S.Wrapper>
      <S.MainView>{children}</S.MainView>
      <S.ToolBaWrapper>
        <ToolBar />
      </S.ToolBaWrapper>
    </S.Wrapper>
  );
}
