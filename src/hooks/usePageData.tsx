import { useAtom } from "jotai";

import { ElementStructure } from "./useRender";
import { PageAtom } from "./atom";

export default function usePageData(pageName: string) {
  const [pageData, setPageData] = useAtom(PageAtom(pageName));

  const updatePageData = (newData: ElementStructure[]) => {
    setPageData(newData);
  };

  return { pageData, updatePageData };
}
