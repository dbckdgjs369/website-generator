import { useGlobalEventEmitter } from "../../GlobalEventEmitterContext";

export default function MainPage() {
  const globalEmitter = useGlobalEventEmitter();
  globalEmitter.on("click", (name) => {
    console.log(`clicked element, ${name}!`);
  });
  return <div></div>;
}
