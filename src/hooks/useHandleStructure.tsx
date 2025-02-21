import { isEmpty } from "lodash";

import { ComponentListType, ElementStructure } from "./atom";

export default function useHandleStructure() {
  function getElementById(
    elements: ComponentListType,
    id: string
  ): ElementStructure | undefined {
    if (isEmpty(elements)) return;
    for (const [key, element] of elements) {
      if (key === id) {
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

  function removeElementById(elements: ComponentListType, targetId: string) {
    for (const [key, element] of elements) {
      const currentObj = element;

      if (key === targetId) {
        // 찾은 경우 해당 객체를 배열에서 제거
        elements.delete(key);
        return elements;
      }

      if (currentObj.inner) {
        // inner 배열이 있는 경우 재귀적으로 탐색
        removeElementById(currentObj.inner, targetId);
      }
    }

    return elements;
  }
  return {
    getElementById,
    removeElementById,
  };
}
