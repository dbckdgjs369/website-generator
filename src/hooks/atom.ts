import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { ElementStructure } from "./useRender";

export const SelectedIDAtom = atom("");

const DEFAULT_PAGE: ElementStructure = {
  id: "default",
  type: "div",
  style: {
    width: "100%",
    height: "100%",
  },
};

export const PageList = atom<Record<string, ElementStructure[]>>({
  main: [{ ...DEFAULT_PAGE }],
});

export const ComponentList = atom<Record<string, ElementStructure[]>>({
  main: [{ ...DEFAULT_PAGE }],
});

const PageAtom = atomFamily((pageName: string) =>
  atom(
    (get) => {
      const pageData = get(PageList)[pageName] ?? [
        JSON.parse(JSON.stringify(DEFAULT_PAGE)),
      ];
      return pageData;
    },
    (get, set, update: ElementStructure[]) => {
      const prev = get(PageList);
      if (prev) {
        set(PageList, {
          ...prev,
          [pageName]: [...update],
        });
      } else {
        set(PageList, {
          [pageName]: [JSON.parse(JSON.stringify(DEFAULT_PAGE))],
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
