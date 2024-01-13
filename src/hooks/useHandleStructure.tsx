/* eslint-disable @typescript-eslint/ban-ts-comment */
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

  function removeElementById(arr: ElementStructure[], targetId: string) {
    for (let i = 0; i < arr.length; i++) {
      const currentObj = arr[i];

      if (currentObj.id === targetId) {
        // 찾은 경우 해당 객체를 배열에서 제거
        arr.splice(i, 1);
        return arr;
      }

      if (currentObj.inner) {
        // inner 배열이 있는 경우 재귀적으로 탐색
        removeElementById(currentObj.inner, targetId);
      }
    }

    return arr;
  }
  return {
    getElementById,
    removeElementById,
  };
}
