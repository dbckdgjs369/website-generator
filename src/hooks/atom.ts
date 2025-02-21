/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export type Position = { x: number; y: number };
export const SelectedIDAtom = atom("");
type StringKeyStringValueObject = {
  [key: string]: string | { [key: string]: string };
};

export interface ElementStructure {
  id: string;
  type: keyof HTMLElementTagNameMap;
  inner?: ComponentListType; //
  style?: CSSStyleDeclaration | StringKeyStringValueObject; //
  text?: string; //
  events?: string;
  position?: Position; //
  root?: boolean;
  props?: Record<string, string>;
}

type PageID = string;
export type ComponentListType = Map<string, ElementStructure>;
export type PageListType = Map<PageID, ComponentListType>;

// const pageData: PageListType = {
//   main: {
//     root:{

//      new Map([
//       [
//         "wrapper2",
//         {
//           id: "wrapper2",
//           type: "section",
//           style: { backgroundColor: "lightgray" },
//           inner: new Map([
//             [
//               "content",
//               {
//                 id: "content",
//                 type: "p",
//                 text: "Hello, this is content!",
//                 style: { color: "blue" },
//               },
//             ],
//           ]),
//         },
//       ],
//     ]),
//   },
//   page1: {
//     id: "page1",
//     type: "div",
//     style: { padding: "10px" },
//     inner: new Map([
//       [
//         "header",
//         {
//           id: "header",
//           type: "h1",
//           text: "Page 1 Header",
//         },
//       ],
//       [
//         "paragraph",
//         {
//           id: "paragraph",
//           type: "p",
//           text: "This is Page 1 content.",
//         },
//       ],
//     ]),
//   },
//   page2: {
//     id: "page2",
//     type: "div",
//     style: { margin: "20px" },
//     inner: new Map([
//       [
//         "title",
//         {
//           id: "title",
//           type: "h2",
//           text: "Welcome to Page 2",
//         },
//       ],
//     ]),
//   },
// }
// };

const findComponentInInner = (
  inner: ComponentListType,
  componentID: string
): ElementStructure | null => {
  for (const [, component] of inner) {
    if (component.id === componentID) return component;
    if (component.inner) {
      const found = findComponentInInner(component.inner, componentID);
      if (found) return found;
    }
  }
  return null;
};
const pageData: PageListType = new Map([
  [
    "main",
    new Map([
      [
        "root",
        {
          id: "title",
          type: "h2",
          text: "h",
        },
      ],
      [
        "root1",
        {
          id: "title",
          type: "h2",
          text: "h",
          inner: new Map([
            [
              "wrapper",
              {
                id: "a",
                type: "h2",
                text: "h3",
              },
            ],
            [
              "wrapper",
              {
                id: "a",
                type: "h2",
                text: "h3",
              },
            ],
          ]),
        },
      ],
      [
        "root2",
        {
          id: "title",
          type: "h2",
          text: "h",
        },
      ],
    ]),
  ],
]);
// pageData.get("main")?.get("")?.inner?.get("")?.inner
export const DEFAULT_PAGE: ElementStructure = {
  id: "default",
  type: "div",
  style: {
    width: "100%",
    height: "100%",
  },
};

//페이지는 object로, 안에 componentList는 Map 으로

export const PageList = atom<PageListType>(new Map());

const Page = atomFamily((pageID: string) =>
  atom(
    (get) => get(PageList)?.get(pageID) ?? {},
    (_, set, update: ComponentListType) => {
      set(PageList, (prev: PageListType) => {
        const newPage = new Map(prev);
        newPage.set(pageID, update);
        return newPage;
      });
    }
  )
);

const Component = atomFamily(
  ({ pageID, componentID }: { pageID: string; componentID: string }) =>
    atom(
      (get) => {
        const pageComponents = get(PageList).get(pageID);
        if (!pageComponents) return null;
        return findComponentInInner(pageComponents, componentID);
      },
      (_, set, update: ElementStructure) => {
        set(PageList, (prev) => {
          const newPageList = new Map(prev);

          // 해당 페이지 가져오기
          const newComponentList =
            new Map(newPageList.get(pageID)) || new Map();

          // 기존 컴포넌트 찾기
          const updateComponent = (components: ComponentListType): boolean => {
            for (const [key, component] of components) {
              if (component.id === componentID) {
                components.set(key, { ...component, ...update });
                return true;
              }
              if (component.inner && updateComponent(component.inner)) {
                return true;
              }
            }
            return false;
          };

          updateComponent(newComponentList);
          newPageList.set(pageID, newComponentList);
          return newPageList;
        });
      }
    )
);

export const updateComponentAttribute = (
  components: ComponentListType,
  componentID: string,
  updates: Partial<ElementStructure>
): boolean => {
  for (const [key, component] of components) {
    if (component.id === componentID) {
      components.set(key, { ...component, ...updates }); // 특정 속성 업데이트
      return true;
    }
    if (
      component.inner &&
      updateComponentAttribute(component.inner, componentID, updates)
    ) {
      return true;
    }
  }
  return false;
};

const ComponentAttributeAtom = atomFamily(
  ({ pageID, componentID }: { pageID: string; componentID: string }) =>
    atom(
      (get) => {
        const pageComponents = get(PageList).get(pageID);
        if (!pageComponents) return null;
        return findComponentInInner(pageComponents, componentID) ?? null;
      },
      (_, set, updates: Partial<ElementStructure>) => {
        set(PageList, (prev) => {
          const newPageList = new Map(prev);
          const newComponentList =
            new Map(newPageList.get(pageID)) || new Map();

          updateComponentAttribute(newComponentList, componentID, updates);
          newPageList.set(pageID, newComponentList);
          return newPageList;
        });
      }
    )
);

export { Page as PageAtom, Component as ComponentAtom, ComponentAttributeAtom };
