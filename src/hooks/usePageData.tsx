import { useAtom, useAtomValue } from "jotai";

import { ElementStructure } from "./useRender";
import { PageAtom, PageList } from "./atom";

export default function usePageData(pageName: string) {
  const [pageData, setPageData] = useAtom(PageAtom(pageName));

  const updatePageData = (newData: ElementStructure[]) => {
    setPageData(newData);
  };

  const pageList = useAtomValue(PageList);

  return { pageData, updatePageData, pageList };
}
