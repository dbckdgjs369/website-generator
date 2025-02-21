/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import { useAtomCallback } from "jotai/utils";
import {
  ComponentListType,
  ElementStructure,
  PageAtom,
  PageList,
  PageListType,
  updateComponentAttribute,
} from "./atom";
import { useAtom, useSetAtom } from "jotai";

export default function usePageHandler() {
  const [pageList, setPageList] = useAtom(PageList);
  console.log("pageList", pageList);
  const addPage = (pageID: string, initialComponents: ComponentListType) => {
    setPageList((prev) => {
      const newPageList = new Map(prev);
      newPageList.set(pageID, initialComponents);
      return newPageList;
    });
  };

  const addComponent = (
    pageID: string,
    componentID: string,
    initialComponent: ComponentListType
  ) => {
    setPageList((prev) => {
      const newPageList = new Map(prev);
      const pageComponents = newPageList.get(pageID) || new Map();

      // 새 컴포넌트 추가
      pageComponents.set(componentID, initialComponent);

      newPageList.set(pageID, pageComponents);
      return newPageList;
    });
  };

  const deleteComponent = (pageID: string, componentID: string) => {
    setPageList((prev) => {
      const newPageList = new Map(prev);
      const pageComponents = newPageList.get(pageID) || new Map();

      // 새 컴포넌트 추가
      pageComponents.delete(componentID);

      newPageList.set(pageID, pageComponents);
      return newPageList;
    });
  };

  const updateComponent = (
    pageID: string,
    componentID: string,
    updates: Partial<ElementStructure>
  ) => {
    setPageList((prev) => {
      const newPageList = new Map(prev);
      const pageComponents = newPageList.get(pageID);

      if (!pageComponents) return newPageList;

      updateComponentAttribute(pageComponents, componentID, updates);
      newPageList.set(pageID, pageComponents);

      return newPageList;
    });
  };
  //컴포넌트 추가 /

  // 페이지 삭제 훅
  const deletePage = (pageID: string) => {
    setPageList((prev) => {
      const newPageList = new Map(prev);
      newPageList.delete(pageID);
      return newPageList;
    });
  };

  return {
    pageList,
    addPage,
    deletePage,
    addComponent,
    updateComponent,
    deleteComponent,
  };
}

// const add_or_update_call = useAtomCallback(
//   useCallback((get, set, data: PushServices.Call.StatusChanged.Data) => {
//     const call = get(PhoneCallAtoms.Call(data.callId));
//     set(PhoneCallAtoms.Call(data.callId), {
//       ...convert_statusdata_to_userinfo(call, data),
//       ...(isEmpty(call) ? { time: 0 } : {})
//     });
//     Configure.useLogLevel >= 8 &&
//       console.debug(LOGTAG, "add_or_update_call:", get(PhoneCallAtoms.Call(data.callId)));
//   }, []),
//   { store: JotaiStore }
// );
