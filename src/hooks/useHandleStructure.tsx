/* eslint-disable no-delete-var */
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
  function removeElementById(
    originData: ElementStructure[],
    elements: ElementStructure[],
    id: string
  ): ElementStructure[] | undefined {
    console.log("originData", originData);
    for (const element of elements) {
      console.log("element", element);
      if (element.id === id) {
        const temp = elements.filter((e) => e.id !== id);
        return temp;
      }
      if (element.inner) {
        const innerElement = removeElementById(originData, element.inner, id);
        if (innerElement) {
          return innerElement;
        }
      }
    }
    return undefined;
  }

  return { getElementById, removeElementById };
}
