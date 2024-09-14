import { ReactNode } from "react";
import * as S from "./emotion";

export default function Row({ children }: { children: ReactNode }) {
  return <S.RowWrapper>{children}</S.RowWrapper>;
}
