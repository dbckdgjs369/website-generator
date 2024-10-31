import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageAtom } from "../../hooks/atom";
import useComponentRender from "../../hooks/useComponentRender";

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { parseElementsToHTML } = useComponentRender();
  const pageData = useAtomValue(PageAtom(id ?? ""));
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
          onClick={() => navigate(`/create/${id}`)}
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
