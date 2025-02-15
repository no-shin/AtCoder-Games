import logo from './logo.svg';
import './App.css';

import React, { useState } from "react";
import Game1 from "./game1"; // マルバツゲーム用のコンポーネント

const App = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">ゲーム選択</h1>
      <div className="flex justify-center gap-4 mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSelectedGame("game1")}>ゲーム1</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSelectedGame("game2")}>ゲーム2</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSelectedGame("game3")}>ゲーム3</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSelectedGame("game4")}>ゲーム4</button>
      </div>
      <div className="border p-4 w-full max-w-md mx-auto bg-gray-100" style={{ minHeight: "300px" }}>
        {selectedGame === "game1" && <Game1 />}
        {selectedGame === "game2" && <p>ゲーム2（未実装）</p>}
        {selectedGame === "game3" && <p>ゲーム3（未実装）</p>}
        {selectedGame === "game4" && <p>ゲーム4（未実装）</p>}
      </div>
    </div>
  );
};

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

export default App;
