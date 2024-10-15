import { useState } from "react";
import { Button, Column, Row } from "groot-component-library";

import usePageData from "../../hooks/usePageData";
import pageIcon from "../../assets/page.svg";
import homeIcon from "../../assets/home.svg";
import * as S from "./emotion";

export default function PageTab() {
  // const [isOpen, setIsOpen] = useState(false);
  const { pageList, addNewPageData } = usePageData("");
  const [pageName, setPageName] = useState("");
  console.log("::pageList", pageList);
  return (
    <Column
      style={{
        position: "relative",
        height: "calc(100vh - 150px)",
        justifyContent: "space-between",
      }}
    >
      <Column style={{ gap: "16px", padding: "8px" }}>
        {Object.keys(pageList)?.map((page) => (
          <Row style={{ gap: "10px", alignItems: "center" }}>
            {page === "main" ? <img src={homeIcon} /> : <img src={pageIcon} />}
            <S.StyledLink to={`/create/${page}`}>{page}</S.StyledLink>
          </Row>
        ))}
      </Column>
      <Row style={{ justifyContent: "space-between" }}>
        <input
          value={pageName}
          onChange={(ev) => setPageName(ev.target.value)}
        />
        <Button
          backgroundColor="gray"
          onClick={() => {
            addNewPageData(pageName);
            setPageName("");
          }}
          style={{ height: "30px", width: "80px" }}
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
