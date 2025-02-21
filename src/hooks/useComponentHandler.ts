import { useAtom } from "jotai";
import { ComponentAtom, ComponentAttributeAtom } from "./atom";

export default function useComponentHandler() {
  // {
  //   pageID,
  //   componentID,
  // }: {
  //   pageID: string;
  //   componentID: string;
  // }
  const [temp, setTemp] = useAtom(
    ComponentAttributeAtom({ pageID, componentID })
  );
  setTemp({
    id: "",
  });

  const [component, setComponent] = useAtom(
    ComponentAtom({ pageID, componentID })
  );
  return { temp, setTemp, setComponent, component };
}
