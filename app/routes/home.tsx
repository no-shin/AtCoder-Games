import type { Route } from  "./+types/home";
// import { Welcome } from     "../games/welcome";
// import { Welcome2 } from    "../games/welcome2";
import { Game1 } from       "../games/game1";
import { Game2 } from       "../games/game2";
import { Header } from      "../components/header";
import { Tabs } from        "../components/tabs";
import { Title } from       "../components/title";

export function meta({}: Route.MetaArgs) {
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
                    // { name: "Game", contents: <Welcome /> },
                    // { name: "Game2", contents: <Welcome2 /> },
                    { name: "Tic Tac Toe", contents: <Game1 /> },
                    { name: "Grid Nim", contents: <Game2 /> },
                ]} 
            /> 
        </div>
    );
}
