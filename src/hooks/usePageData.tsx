import { useAtom } from "jotai";

import { ElementStructure } from "./useRender";
import { Page } from "./atom";

export default function usePageData(pageName: string) {
  const [pageData, setPageData] = useAtom(Page(pageName));

  const updatePageData = (newData: ElementStructure[]) => {
    setPageData(newData);
  };

  return { pageData, updatePageData };
}
