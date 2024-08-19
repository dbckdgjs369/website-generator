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

const ComponentList = atom<Record<string, ElementStructure[]>>({
  main: [{ ...DEFULAT_PAGE }],
});

const PageAtom = atomFamily((pageName: string) =>
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

const ComponentAtom = atomFamily((componentName: string) =>
  atom(
    (get) => get(ComponentList)[componentName] ?? {},
    (get, set, update: ElementStructure[]) => {
      const prev = get(ComponentList);
      if (prev) {
        set(ComponentList, {
          ...prev,
          [componentName]: [...update],
        });
      }
    }
  )
);

export { PageAtom, ComponentAtom };
