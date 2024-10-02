/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

import * as S from "./emotion";
import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { Column } from "groot-component-library";
import { HeaderType } from "../../componentList/Header";
import { NavigationBarType } from "../../componentList/NavigationBar";
import { useEffect, useState } from "react";

const PropsMap = {
  input: { name: "" } as { name?: string },
  header: { title: "Groot's Tech Blog", color: "greenyellow" } as HeaderType,
  nav: { text: "default", href: "" } as NavigationBarType,
};

export default function ToolBarWithComponent() {
  const globalEmitter = useGlobalEventEmitter();
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState<Record<string, string>>({});

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
      props: PropsMap[componentName as "input" | "nav" | "header"],
    });
  };

  // const [selectedID, setSelectedID] = useState("default");
  const [props, setProps] = useState({});
  useEffect(() => {
    // globalEmitter.on("id", setSelectedID);
    globalEmitter.on("props", setProps);
    return () => {
      // globalEmitter.off("id", setSelectedID);
      globalEmitter.off("props", setProps);
    };
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sendProps = (key: string, defaultValue: string) => {
    const value = inputValues[key];
    globalEmitter.emit("update_props", key, value ?? defaultValue);
  };

  return (
    <S.ToolBarWrapper>
      <Column>
        <Column tag="div" style={{ gap: "10px" }}>
          <button onClick={() => handleFile("save")}>save</button>
          <button onClick={() => handleFile("load")}>load</button>
          <button onClick={() => handleElement("delete")}>delete</button>
          <button onClick={(ev) => addElement(ev)} id={"input"} key={"input"}>
            input
          </button>
          <button onClick={(ev) => addElement(ev)} id={"header"} key={"header"}>
            header
          </button>
          <button onClick={(ev) => addElement(ev)} id={"nav"} key={"nav"}>
            nav
          </button>
          <button onClick={(ev) => addElement(ev)} id={"div"} key={"div"}>
            div
          </button>
          <button onClick={() => navigate("/")}>result</button>
        </Column>
        <S.CurrentStatusWrapper>
          {!isEmpty(props) &&
            Object.entries(props && JSON.parse(props as string))?.map(
              ([key, value]) => (
                <div>
                  {key}:
                  <input
                    defaultValue={value as string}
                    onChange={(e) => {
                      handleInputChange(
                        key,
                        e.target.value?.length === 0
                          ? (value as string)
                          : e.target.value
                      );
                    }}
                  />
                  <button onClick={() => sendProps(key, value as string)}>
                    update
                  </button>
                </div>
              )
            )}
        </S.CurrentStatusWrapper>
      </Column>
    </S.ToolBarWrapper>
  );
}
