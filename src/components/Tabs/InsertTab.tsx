import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Column } from "groot-component-library";

import { useGlobalEventEmitter } from "../../provider/GlobalEventProvider/GlobalEventEmitterContext";
import { SelectedIDAtom } from "../../hooks/atom";
import { NavigationBarType } from "../../componentList/NavigationBar";
import { ALL_TYPO_TYPE_LIST, TypoType } from "../../componentList/Typo";
import * as S from "./emotion";

type PropsType = {
  type?: string;
  props?: Record<string, string>;
};

const PROPS_MAP = {
  nav: { text: "default", href: "" } as NavigationBarType,
  typo: { text: "typo", color: "", typoSize: "span" } as TypoType,
};

export default function InsertTab() {
  const globalEmitter = useGlobalEventEmitter();
  const selectedID = useAtomValue(SelectedIDAtom);
  const [props, setProps] = useState<PropsType>({});

  const handleElement = (type: "delete") => {
    globalEmitter.emit(type);
  };

  const addElement = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const componentName = ev.currentTarget.id;
    console.log(":::componentName", componentName);
    globalEmitter.emit("add", {
      type: componentName,
      props: PROPS_MAP[componentName as "nav" | "typo"],
    });
    console.log(":::after");
  };

  const sendProps = (key: string, defaultValue: string) => {
    const value = props?.props?.[key];
    globalEmitter.emit("update_props", key, value ?? defaultValue);
  };

  const handleInputChange = (key: string, value: string) => {
    setProps((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [key]: value,
      },
    }));
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
  }, []);
  console.log("props", props);
  return (
    <Column
      tag="div"
      style={{
        gap: "10px",
        width: "100%",
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <Column style={{ gap: "20px" }}>
        <S.StyledButton
          backgroundColor="#6c757d"
          onClick={(ev) => addElement(ev)}
          id={"typo"}
          key={"typo"}
        >
          typography
        </S.StyledButton>
        <S.StyledButton
          backgroundColor="#6c757d"
          onClick={(ev) => addElement(ev)}
          id={"nav"}
          key={"nav"}
        >
          nav
        </S.StyledButton>
      </Column>
      <S.CurrentStatusWrapper>
        {props?.props &&
          Object.entries(props?.props)?.map(([key, value]) => (
            <Column style={{ gap: "8px" }} key={key}>
              {key}:
              {key === "typoSize" ? (
                <select
                  value={value}
                  onChange={(e) => {
                    handleInputChange(key, e.target.value);
                  }}
                >
                  {ALL_TYPO_TYPE_LIST.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={value}
                  onChange={(e) => {
                    handleInputChange(key, e.target.value);
                  }}
                />
              )}
              <S.StyledButton
                backgroundColor="#17a2b8"
                onClick={() => sendProps(key, value as string)}
              >
                update
              </S.StyledButton>
            </Column>
          ))}
      </S.CurrentStatusWrapper>
      <S.StyledButton
        backgroundColor={"#dc3545"}
        onClick={() => handleElement("delete")}
        disabled={selectedID.length === 0}
      >
        delete
      </S.StyledButton>
    </Column>
  );
}
