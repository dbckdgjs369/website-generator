import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Column, Row } from "groot-component-library";

import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { NavigationBarType } from "../../componentList/NavigationBar";
import { TypoType } from "../../componentList/Typo";

const PropsMap = {
  nav: { text: "default", href: "" } as NavigationBarType,
  typo: { text: "typo", color: "", typoSize: "span" } as TypoType,
};

export default function ToolBarWithComponent() {
  const globalEmitter = useGlobalEventEmitter();
  const navigate = useNavigate();

  const [props, setProps] = useState<Record<string, string>>({});

  const handleFile = (type: "save" | "load") => {
    globalEmitter.emit("file", type);
  };

  const handleElement = (type: "delete") => {
    globalEmitter.emit(type);
  };

  const addElement = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const componentName = ev.currentTarget.id;
    globalEmitter.emit("add", {
      type: componentName,
      props: PropsMap[componentName as "nav" | "typo"],
    });
  };

  useEffect(() => {
    globalEmitter.on("props", (props: string) => {
      console.log("props", props);
      props && setProps(JSON.parse(props));
    });
    return () => {
      globalEmitter.off("props", (props: string) => {
        props && setProps(JSON.parse(props));
      });
    };
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setProps((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sendProps = (key: string, defaultValue: string) => {
    const value = props[key];
    globalEmitter.emit("update_props", key, value ?? defaultValue);
  };

  return (
    <S.ToolBarWrapper>
      <Column style={{ gap: "20px" }}>
        <Column tag="div" style={{ gap: "10px" }}>
          <StyledButton
            backgroundColor="#6c757d"
            onClick={(ev) => addElement(ev)}
            id={"typo"}
            key={"typo"}
          >
            typography
          </StyledButton>
          <StyledButton
            backgroundColor="#6c757d"
            onClick={(ev) => addElement(ev)}
            id={"nav"}
            key={"nav"}
          >
            nav
          </StyledButton>
          <StyledButton
            backgroundColor="#ffc107"
            onClick={() => navigate("/result")}
          >
            result
          </StyledButton>
        </Column>
        <S.CurrentStatusWrapper>
          {props &&
            Object.entries(props)?.map(([key, value]) => (
              <Column style={{ gap: "8px" }}>
                {key}:
                <input
                  value={props[key]}
                  onChange={(e) => {
                    handleInputChange(key, e.target.value);
                  }}
                />
                <StyledButton
                  backgroundColor="#17a2b8"
                  onClick={() => sendProps(key, value as string)}
                >
                  update
                </StyledButton>
              </Column>
            ))}
        </S.CurrentStatusWrapper>
      </Column>
      <Row style={{ width: "100%", gap: "16px" }}>
        <StyledButton
          color={"white"}
          backgroundColor={"#007bff"}
          onClick={() => handleFile("save")}
        >
          save
        </StyledButton>
        <StyledButton
          backgroundColor={"#28a745"}
          onClick={() => handleFile("load")}
        >
          load
        </StyledButton>
      </Row>
      <StyledButton
        backgroundColor={"#dc3545"}
        onClick={() => handleElement("delete")}
      >
        delete
      </StyledButton>
    </S.ToolBarWrapper>
  );
}

const StyledButton = styled(Button)`
  width: 100%;
`;
