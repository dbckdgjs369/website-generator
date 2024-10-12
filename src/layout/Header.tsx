import { useNavigate } from "react-router-dom";
import { Button, Row } from "groot-component-library";

import * as S from "./emotion";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";

export default function Header() {
  const navigate = useNavigate();
  const globalEmitter = useGlobalEventEmitter();

  const handleFile = (type: "save" | "load") => {
    globalEmitter.emit("file", type);
  };
  return (
    <S.Header tag={"header"}>
      <div style={{ border: "1px solid", width: "20px", height: "20px" }}></div>
      <Row style={{ gap: "10px" }}>
        <Button
          backgroundColor="#ffc107"
          style={{ height: "30px" }}
          onClick={() => navigate("/result")}
        >
          result
        </Button>
        <Button
          style={{ height: "30px" }}
          color={"white"}
          backgroundColor={"#007bff"}
          onClick={() => handleFile("save")}
        >
          save
        </Button>
        <Button
          style={{ height: "30px" }}
          backgroundColor={"#28a745"}
          onClick={() => handleFile("load")}
        >
          load
        </Button>
      </Row>
    </S.Header>
  );
}
