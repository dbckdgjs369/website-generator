import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { ElementStructure } from "./useRender";

const DEFULAT_PAGE: ElementStructure = {
  id: "default",
  type: "div",
  style: {
    width: "100%",
    height: "100%",
  },
};

const PageList = atom<Record<string, ElementStructure[]>>({
  main: [{ ...DEFULAT_PAGE }],
});

const Page = atomFamily((pageName: string) =>
  atom(
    (get) => get(PageList)[pageName] ?? [DEFULAT_PAGE],
    (get, set, update: ElementStructure[]) => {
      const prev = get(PageList);
      if (prev) {
        set(PageList, {
          ...prev,
          [pageName]: [...update],
        });
      }
    }
  )
);

export { Page };
