// import { FC, useState } from "react";
import { useState } from "react";
// import "./styles.css";

type TabProps = {
    tabs: { name: string, contents: JSX.Element }[]
}

export const Tabs = ({ tabs }: TabProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  // [["Path", "Name"], ..., ]

  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab)}
        >
          {tab.name}
        </button>
      ))}
      <div>{activeTab.contents}</div>
    </div>
  );
};
