import { useAtom } from "jotai";

import { ElementStructure } from "./useRender";
import { DEFAULT_PAGE, PageAtom, PageList } from "./atom";

export default function usePageData(pageName: string) {
  const [pageData, setPageData] = useAtom(PageAtom(pageName));
  const [pageList, setPageList] = useAtom(PageList);

  const updatePageData = (newData: ElementStructure[]) => {
    setPageData(newData);
  };
  const addNewPageData = (name: string) => {
    setPageList((prev) => ({
      ...prev,
      [name]: [DEFAULT_PAGE],
    }));
  };

  return { pageData, updatePageData, pageList, addNewPageData };
}
