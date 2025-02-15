import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Welcome2 } from "../welcome/welcome2";
import { Game1 } from "../welcome/Game1";
import { Tabs } from "../components/tabs";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "AtCoder-Games" },
    { name: "description", content: "AtCoDeer" },
  ];
}

export default function Home() {
  return <Tabs tabs={[{name: "Game1", contents: <Game1 />}, {name: "Game2", contents: <Welcome2 />}]} />;
  // return <Welcome />;
}
