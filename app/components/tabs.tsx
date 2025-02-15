import React, { useState } from "react";
import "./tabs.css";

type TabProps = {
    tabs: { name: string, contents: JSX.Element }[]
}

export const Tabs = ({ tabs }: TabProps) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className="tabs-container">
            <div className="tabs-buttons">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? "active" : ""}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {activeTab.contents}
            </div>
        </div>
    );
};
