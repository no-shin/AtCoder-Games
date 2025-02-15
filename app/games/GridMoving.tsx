import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GridMoving.css';

type Grid = string[][];
type Position = { y:number; x:number; };

export const GridMoving: React.FC = () => {
  console.log("enable");
  const [H, setH] = useState<number>(4);
  const [W, setW] = useState<number>(5);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [piece, setPiece] = useState<Position>({y:0, x:0});
  const [turn, setTurn] = useState<number>(0); // (0:先手 1:後手)
  const [resultText, setResultText] = useState<string>("");

  const generateGrid = useCallback((height: number, width: number): Grid =>{
    const newGrid: Grid = [];
    for(let y=0; y<height; y++){
      const row: string[] = [];
      for(let x=0; x<width; x++){
        row.push(Math.random() < 0.6 ? '.' : '#');
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  const enumerateCandidatesPos = useCallback((currntPiece: Position): Position[] => {
    const candidatesPos: Position[] = [];
    const moves = [{y:0, x:1}, {y:1, x:0}, {y:1,x:1}];
    for(const move of moves){
      const ny = currntPiece.y+move.y;
      const nx = currntPiece.x+move.x;
      if(ny<0 || H<=ny || nx<0 || W<=nx || !grid || grid[ny][nx]==='#') continue;
      candidatesPos.push({y:ny, x:nx});
    }
    return candidatesPos;
  }, [H,W,grid]);

  const getCPUResult = useCallback(async (currentPiece: Position): Promise<{win:boolean, path:Position[]}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let CPUWin = null;
    const dp: boolean[][] = Array(H).fill(null).map(() => Array(W).fill(false));
    for(let r = H - 1; r >= 0; r--){
      for(let c = W - 1; c >= 0; c--){
        if(grid && grid[r][c] === '#') continue; // 障害物は無視
        let win = false;
        // 下方向
        if(r + 1 < H && grid && grid[r + 1][c] === '.'){
          if(!dp[r + 1][c]) win = true;
        }
        // 右方向
        if(c + 1 < W && grid && grid[r][c + 1] === '.'){
          if(!dp[r][c + 1]) win = true;
        }
        // 右下方向
        if(r + 1 < H && c + 1 < W && grid && grid[r + 1][c + 1] === '.'){
          if(!dp[r + 1][c + 1]) win = true;
        }
        dp[r][c] = win;
      }
    }
    
    // CPU目線で後手必勝 -> CPUが勝てない
    if(!dp[currentPiece.y][currentPiece.x]){
      return {win:false,path:[]};
    }

    let path: Position[] = [];
    let internal_turn = 0;
    let y=currentPiece.y;
    let x=currentPiece.x;
    path.push({y:y, x:x});
    while(true){
      const candidatesPos = enumerateCandidatesPos({y,x});
      if(candidatesPos.length===0) break; // 動けないので終了
      let nextPos: Position | undefined;
      if(internal_turn===0){ // 先手: 最適な手を選択
        for(const Pos of candidatesPos){
          const ny = Pos.y;
          const nx = Pos.x;
          if(!dp[ny][nx]){
            nextPos = Pos;
            break;
          }
        }
      }else{ // 後手: どう選んでも同じなので適当に仮定
        nextPos = candidatesPos[0];
      }

      if(nextPos){
        y = nextPos.y;
        x = nextPos.x;
        path.push({y:y, x:x});
        internal_turn = 1-internal_turn;
      }else break; // 一応nextPos===undefinedなときに
    }
    return {win:true, path:path};
  }, [H,W,grid]);

  const nextTurn = useCallback(async () => {
    if(!grid) return;
    const candidatesPos = enumerateCandidatesPos(piece);
    if(candidatesPos.length === 0){
      const winner = (turn === 0 ? "CPU" : "You");
      setResultText("${winner}$ Win!");
      return;
    }
    
    if(turn === 1){
      const CPUResult = await getCPUResult(piece);
      let destination: Position;
      if(CPUResult.win){
        destination = CPUResult.path[0];
      }else{
        const candidatesPos = enumerateCandidatesPos(piece);
        destination = candidatesPos[Math.floor(Math.random() * candidatesPos.length)];
      }
      setPiece(destination);
      setTurn(0);
      setTimeout(nextTurn, 0);
    }
  }, [grid,enumerateCandidatesPos,piece,turn,getCPUResult]);

  const generateGame = useCallback(() => {
    if(isNaN(H) || isNaN(W) || H<=0 || W<=0){
      alert("HとWに正の整数を入力してください");
      return;
    }
    if(100<H || 100<W){
      alert("HとWはそれぞれ100以下にしてください");
      return;
    }
    setGrid(generateGrid(H,W));
    setPiece({y:0, x:0});
    setTurn(0);
    setResultText("");
    nextTurn();
  },[H,W,generateGrid,nextTurn]);

  const handleCellClick = useCallback((y:number, x:number) => {
    if(turn!==0 || !grid) return;
    const candidatesPos = enumerateCandidatesPos(piece);
    const destination = candidatesPos.find(candidatesPos => candidatesPos.y === y && candidatesPos.x === x);

    if(destination){
      setPiece(destination);
      setTurn(1);
      nextTurn();
    }else{
      alert("そこには移動できません");
    }
  },[grid,piece,turn,enumerateCandidatesPos,nextTurn]);

  const isCandidate = useCallback((y:number, x:number): boolean => {
    if(turn!==0) return false;
    const candidatesPos = enumerateCandidatesPos(piece);
    return !!candidatesPos.find(candidatesPos => candidatesPos.y===y && candidatesPos.x===x);
  }, [piece,turn,enumerateCandidatesPos]);

  return (
    <div>
      <h1>GridMoving</h1>

      <div>
        <label htmlFor="HeightInput">高さ (H):</label>
        <input
          type="number"
          id="HeightInput"
          value={H}
          onChange={(e) => setH(parseInt(e.target.value))}
        />
        <label htmlFor="WidthInput">幅 (W):</label>
        <input
          type="number"
          id="WidthInput"
          value={W}
          onChange={(e) => setW(parseInt(e.target.value))}
        />
        <button onClick={generateGame}>Generate</button>
      </div>

      <div id="board">
        {grid && (
          <table className="board-table">
            <tbody>
              {grid.map((row,y) => (
                <tr key={y}>
                  {row.map((cell,x) => (
                    <td
                      key={x}
                      className={`cell ${y === piece.y && x === piece.x ? 'piece' : ''} ${isCandidate(y, x) ? 'candidate' : ''}`}
                      onClick={() => handleCellClick(y, x)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div id="result">{resultText}</div>
    </div>
  );
};
