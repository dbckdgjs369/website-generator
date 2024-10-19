import { Column, Tab } from "groot-component-library";

import * as S from "./emotion";
import PageTab from "../Tabs/PageTab";
import InsertTab from "../Tabs/InsertTab";

export default function ToolBarWithComponent() {
  return (
    <S.ToolBarWrapper>
      <Column style={{ gap: "20px", alignItems: "center", width: "100%" }}>
        <Tab.Provider defaultTab="insert">
          <Tab.List style={{ borderBottom: "1px solid #ddd" }}>
            <Tab value="insert">Insert</Tab>
            <Tab value="page">Pages</Tab>
            <Tab value="theme">Themes</Tab>
          </Tab.List>
          <Tab.Panel value="insert">
            <InsertTab />
          </Tab.Panel>
          <Tab.Panel value="page">
            <PageTab />
          </Tab.Panel>
          <Tab.Panel value="theme">
            <div>theme</div>
          </Tab.Panel>
        </Tab.Provider>
      </Column>
    </S.ToolBarWrapper>
  );
}
