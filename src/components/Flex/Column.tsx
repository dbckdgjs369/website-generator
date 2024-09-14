import { ReactNode } from "react";
import * as S from "./emotion";

export default function Column({ children }: { children: ReactNode }) {
  return <S.ColumnWrapper>{children}</S.ColumnWrapper>;
}
