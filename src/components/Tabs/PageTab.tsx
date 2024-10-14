import { useState } from "react";
import { Button, Column, Row } from "groot-component-library";
import { Link } from "react-router-dom";

import usePageData from "../../hooks/usePageData";

export default function PageTab() {
  // const [isOpen, setIsOpen] = useState(false);
  const { pageList, addNewPageData } = usePageData("");
  const [pageName, setPageName] = useState("");
  console.log("::pageList", pageList);
  return (
    <Column style={{ position: "relative", height: "calc(100vh - 150px)" }}>
      <Column>
        {Object.keys(pageList)?.map((page) => (
          <Link to={`/create/${page}`}>{page}</Link>
        ))}
      </Column>
      <Row style={{ gap: "10px" }}>
        <input onChange={(ev) => setPageName(ev.target.value)} />
        <Button
          backgroundColor="#ccc"
          onClick={() => addNewPageData(pageName)}
          // onClick={() => navigate(`/create/${pageName}`)}
          style={{ height: "30px" }}
        >
          add page
        </Button>
      </Row>
      {/* <Button
        color="black"
        backgroundColor="white"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          fontSize: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease",
        }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        +
      </Button> */}
    </Column>
  );
}
