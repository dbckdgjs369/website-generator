import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Row } from "groot-component-library";

import * as S from "./emotion";
import Img from "../assets/groot.png";
import { useGlobalEventEmitter } from "../provider/GlobalEventProvider/GlobalEventEmitterContext";

export default function Header() {
  const navigate = useNavigate();
  const globalEmitter = useGlobalEventEmitter();
  const { id } = useParams();

  const handleFile = (type: "save" | "load") => {
    globalEmitter.emit("file", type);
  };
  return (
    <S.Header tag={"header"}>
      <Avatar src={Img} size={30} />
      <Row style={{ gap: "10px" }}>
        <Button
          backgroundColor="#ffc107"
          style={{ height: "30px" }}
          onClick={() => navigate(`/result/${id}`)}
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
