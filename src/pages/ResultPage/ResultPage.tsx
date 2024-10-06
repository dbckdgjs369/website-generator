import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageAtom } from "../../hooks/atom";
import useRender2 from "../../hooks/useRender2";

export default function ResultPage() {
  const navigate = useNavigate();
  const { parseElementsToHTML } = useRender2();
  const pageData = useAtomValue(PageAtom("test"));
  console.log("::pageData", pageData);
  const [isHover, setIsHover] = useState(false);
  const isFirstTime = Boolean(!pageData[0]?.inner);

  useEffect(() => {
    parseElementsToHTML(pageData, "result");
  }, []);

  return (
    <div
      style={{ position: "relative", width: "100vw", height: "100vh" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div id="init" />
      {(isHover || isFirstTime) && (
        <button
          onClick={() => navigate("/create")}
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
          }}
        >
          {isFirstTime ? "create" : "edit"}
        </button>
      )}
    </div>
  );
}
