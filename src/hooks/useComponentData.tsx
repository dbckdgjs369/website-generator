import { useAtom, useAtomValue } from "jotai";

import { ElementStructure } from "./useRender";
import { ComponentAtom, ComponentList } from "./atom";

export default function useComponentData(pageName: string) {
  const [componentData, setComponentData] = useAtom(ComponentAtom(pageName));

  const updateComponentData = (newData: ElementStructure[]) => {
    setComponentData(newData);
  };

  const componentList = useAtomValue(ComponentList);

  return { componentData, updateComponentData, componentList };
}
