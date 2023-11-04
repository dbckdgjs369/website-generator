import { ElementStructure } from "./useRender";

export default function useHandleStructure() {
  // 배열 핸들러
  function getElementById(
    elements: ElementStructure[],
    id: string
  ): ElementStructure | undefined {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (element.inner) {
        const innerElement = getElementById(element.inner, id);
        if (innerElement) {
          return innerElement;
        }
      }
    }
    return undefined;
  }

  const addElement = (
    originArr: ElementStructure[],
    targetID: string,
    addStructure: ElementStructure
  ) => {
    const updateArr = { ...originArr };
    console.log("originArr", originArr);
    console.log("targetID", targetID);
    console.log("add", addStructure);
    const st = getElementById(updateArr, targetID);
    if (st) {
      if (st.inner) {
        st.inner.push(addStructure);
      } else {
        st.inner = [addStructure];
      }
    }
    return updateArr;
  };
  return { addElement };
}
