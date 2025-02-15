import type { Route } from "./+types/home";
import { TicTacToe } from "../games/TicTacToe";
import { GridNim } from "../games/GridNim";
import { GridMoving } from "../games/GridMoving";
import { Header } from "../components/header";
import { Tabs } from "../components/tabs";
import { Title } from "../components/title";
import { Konnan } from "../games/Konnan";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "AtCoder-Games" },
        { name: "description", content: "AtCoDeer" },
    ];
}

export default function Home() {
    return (
        <div>
            <Header titleName="AtCoder Games"
                githubLink="https://github.com/amesyu/AtCoder-Games"
            />

            <Tabs
                tabs={[
                    { name: "Tic Tac Toe", contents: <TicTacToe /> },
                    { name: "Grid Nim", contents: <GridNim /> },
                    { name: "Grid Moving", contents: <GridMoving /> },
                    { name: "Konnan", contents: <Konnan /> },
                ]}
            />
        </div>
    );
}
