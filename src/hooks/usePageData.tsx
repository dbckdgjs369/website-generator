/* eslint-disable react-hooks/rules-of-hooks */
import { atom, useAtomValue } from "jotai";
import { atomFamily, useAtomCallback } from "jotai/utils";

import { ElementStructure } from "./useRender";

type PageData = Record<string, ElementStructure[]>;

export const PageDataAtom = atom<PageData>({
  main: [
    {
      id: "default",
      type: "div",
      style: {
        width: "100%",
        height: "100%",
      },
    },
  ],
  component: [
    {
      id: "default",
      type: "div",
      style: {
        width: "100%",
        height: "100%",
      },
    },
  ],
});
export const PageDataAtomFamily = atomFamily((id: string) =>
  atom(
    (get) => {
      const pageData = get(PageDataAtom)[id];
      return pageData ? pageData : undefined;
    },
    (get, set, update: ElementStructure[]) => {
      const prev = get(PageDataAtom);
      set(PageDataAtom, {
        ...prev,
        [id]: [...update],
      });
    }
  )
);

export default function usePageData(pageName: string) {
  const atom = useAtomValue(PageDataAtomFamily(pageName));
  const setPage = useAtomCallback(
    (_, set, update: { pageName: string; data: ElementStructure[] }) => {
      set(PageDataAtomFamily(update.pageName), update.data);
    }
  );

  //   const getPage = useAtomCallback((get, _, params: { pageName: string }) =>
  //     get(PageDataAtomFamily(params.pageName))
  //   );
  //   const getPage = (pageName: string) => {
  //     return useAtomValue(PageDataAtomFamily(pageName));
  //   };

  //   const add = ({ pageName }: { pageName: string }) => {
  //     PageDataAtomFamily;
  //   };
  return { setPage, pageData: atom };
}
