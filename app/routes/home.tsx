import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Welcome2 } from "../welcome/welcome2";
import { Game1 } from "../games/Game1";
import { Tabs } from "../components/tabs";
import { Title } from "../components/title";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "AtCoder-Games" },
        { name: "description", content: "AtCoDeer" },
    ];
}

export default function Home() {
    return (
        <div>
            <Title titleName="AtCoder Games" /> {}
            <Tabs
                tabs={[
                    { name: "Tic Tac Toe", contents: <Game1 /> },
                    { name: "Game2", contents: <Welcome2 /> }
                ]}
            />
        </div>
    );
}
