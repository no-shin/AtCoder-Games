import { useState, useRef, useEffect } from "react";

/*
0 -> empty (white)
1 -> black
2 -> blocked (gray)
*/

const boardSize = 19;
const cellSize = 30;

export function GridNim() {
  const [squares, setSquares] = useState<number[]>(
    Array(boardSize * boardSize).fill(0).map(() => (Math.random() > 0.5 ? 2 : 0))
  );
  const [status, setStatus] = useState("Game in Progress");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      drawBoard();
    }
  }, [squares, ctx]);

  function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, boardSize * cellSize, boardSize * cellSize);
    squares.forEach((value, index) => {
      const x = (index % boardSize) * cellSize;
      const y = Math.floor(index / boardSize) * cellSize;
      ctx.fillStyle = value === 0 ? "white" : value === 1 ? "black" : "gray";
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.strokeRect(x, y, cellSize, cellSize);
    });
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!ctx || status !== "Game in Progress") return;
    const board = [...squares];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = Math.floor((event.clientY - rect.top) / cellSize);
    let y = Math.floor((event.clientX - rect.left) / cellSize);

    // flip function
    let index = x * boardSize + y;
    if (board[index] !== 0) return;
    board[index] = 1;
    for(let x_ = x + 1; x_ < boardSize; x_++) {
      let p = x_ * boardSize + y;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    for(let x_ = x - 1; x_ >= 0; x_--) {
      let p = x_ * boardSize + y;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    for(let y_ = y + 1; y_ < boardSize; y_++) {
      let p = x * boardSize + y_;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    for(let y_ = y - 1; y_ >= 0; y_--) {
      let p = x * boardSize + y_;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    
    if(evalState(board)) {
      console.log("You Win!");
      setStatus("You Win!");
      setSquares(board);
      return;
    }
      
    // flip function
    index = calcCPU(board);
    x = Math.floor(index / boardSize);
    y = index % boardSize;
    if (board[index] !== 0) return;
    board[index] = 1;
    for(let x_ = x + 1; x_ < boardSize; x_++) {
      let p = x_ * boardSize + y;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    for(let x_ = x - 1; x_ >= 0; x_--) {
      let p = x_ * boardSize + y;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    for(let y_ = y + 1; y_ < boardSize; y_++) {
      let p = x * boardSize + y_;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }
    for(let y_ = y - 1; y_ >= 0; y_--) {
      let p = x * boardSize + y_;
      if(board[p] !== 1) board[p] = 1;
      else break;
    }

    if(evalState(board)) {
      console.log("You Lose!");
      setStatus("You Lose!");
      setSquares(board);
      return;
    }
      
    setSquares(board);
  }


  function evalState(board: number[]): boolean {
    return board.every((sq) => (sq !== 0));
  }
  function calcCPU(board: number[]): number {
    let buf: number[] = [];
    let dp: number[][][][] = [];

    for (let lx = 0; lx <= boardSize; lx++) {
      dp[lx] = [];
      for (let rx = 0; rx <= boardSize; rx++) {
        dp[lx][rx] = [];
        for (let ly = 0; ly <= boardSize; ly++) {
          dp[lx][rx][ly] = [];
          for (let ry = 0; ry <= boardSize; ry++) {
            dp[lx][rx][ly][ry] = 0;
          }
        }
      }
    }

    function mex(sz: number): number {
      let seen: boolean[] = new Array(sz).fill(false);
      for (let i = 0; i < sz; i++) if (buf[i] < sz) seen[buf[i]] = true;
      for (let i = 0; i < sz; i++) if (!seen[i]) return i;
      return sz;
    } 

    for (let lx = boardSize - 1; lx >= 0; lx--)
      for (let rx = lx + 1; rx <= boardSize; rx++)
        for (let ly = boardSize - 1; ly >= 0; ly--)
          for (let ry = ly + 1; ry <= boardSize; ry++) {
            let sz = 0;
            for (let mx = lx; mx < rx; mx++)
              for (let my = ly; my < ry; my++)
                if (board[mx * boardSize + my] !== 2) {
                  let now =
                    dp[lx][mx][ly][my] ^
                    dp[mx + 1][rx][ly][my] ^
                    dp[lx][mx][my + 1][ry] ^
                    dp[mx + 1][rx][my + 1][ry];
                  buf[sz++] = now;
                }
            dp[lx][rx][ly][ry] = mex(sz);
          }

    function calcGrundy(p: number): number {
      let a = board.map((cell) => (cell === 0 ? 1 : 0));
      a[p] = 0;
      const x = Math.floor(p / boardSize);
      const y = p % boardSize;
      // console.log(a);

      for (let j = x + 1; j < boardSize && a[j*boardSize+y] === 1; j++)
          a[j*boardSize+y] = 0;
      for (let j = x - 1; j >= 0 && a[j*boardSize+y] === 1; j--) 
          a[j*boardSize+y] = 0;
      for (let j = y + 1; j < boardSize && a[x*boardSize+j] === 1; j++) 
          a[x*boardSize+j] = 0;
      for (let j = y - 1; j >= 0 && a[x*boardSize+j] === 1; j--)
          a[x*boardSize+j] = 0;
      
      let res = 0;
      for (let i = 0; i < boardSize; i++)
        for (let j = 0; j < boardSize; j++)
          if (a[i*boardSize+j] === 1) {
            let ii = i, jj = j;
            while (ii < boardSize && a[ii*boardSize+jj] === 1) ii++;
            ii--;
            while (jj < boardSize && a[ii*boardSize+jj] === 1) jj++;
            ii++;
            for (let iii = i; iii < ii; iii++)
              for (let jjj = j; jjj < jj; jjj++) a[iii*boardSize+jjj] = 0;
            res ^= dp[i][ii][j][jj];
          }
      return res;
    }

    for (let i = 0; i < boardSize * boardSize; i++) {
      if (board[i] === 0 && calcGrundy(i) === 0) return i;
    }
    console.log("Fail to Find Grundy == 0");
    for (let i = 0; i < boardSize * boardSize; i++) {
      if (board[i] === 0) return i;
    }
    return -1;
  }

  return (
    <div>
      <h2>{status}</h2>
      <canvas ref={canvasRef} width={boardSize * cellSize} height={boardSize * cellSize} onClick={handleClick} />
    </div>
  );
}
