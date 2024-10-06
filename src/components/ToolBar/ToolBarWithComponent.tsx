import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "groot-component-library";

import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { HeaderType } from "../../componentList/Header";
import { NavigationBarType } from "../../componentList/NavigationBar";
import { TypoType } from "../../componentList/Typo";

const PropsMap = {
  header: { title: "Groot's Tech Blog", color: "greenyellow" } as HeaderType,
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
      props: PropsMap[componentName as "nav" | "header" | "typo"],
    });
  };

  useEffect(() => {
    globalEmitter.on("props", (props: string) => {
      props && setProps(JSON.parse(props));
    });
    return () => {
      globalEmitter.off("props", (props: string) => {
        props && setProps(JSON.parse(props));
      });
    };
  }, [props]);

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
      <Column>
        <Column tag="div" style={{ gap: "10px" }}>
          <button onClick={() => handleFile("save")}>save</button>
          <button onClick={() => handleFile("load")}>load</button>
          <button onClick={() => handleElement("delete")}>delete</button>
          <button onClick={(ev) => addElement(ev)} id={"header"} key={"header"}>
            header
          </button>
          <button onClick={(ev) => addElement(ev)} id={"typo"} key={"typo"}>
            typography
          </button>
          <button onClick={(ev) => addElement(ev)} id={"nav"} key={"nav"}>
            nav
          </button>
          <button onClick={() => navigate("/result")}>result</button>
        </Column>
        <S.CurrentStatusWrapper>
          {props &&
            Object.entries(props)?.map(([key, value]) => (
              <div>
                {key}:
                <input
                  value={props[key]}
                  onChange={(e) => {
                    handleInputChange(key, e.target.value);
                  }}
                />
                <button onClick={() => sendProps(key, value as string)}>
                  update
                </button>
              </div>
            ))}
        </S.CurrentStatusWrapper>
      </Column>
    </S.ToolBarWrapper>
  );
}
