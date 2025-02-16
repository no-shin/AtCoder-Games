import React, { useEffect, useRef, useState } from 'react';
import './Konnan.css'

const GRID_SIZE = 16;
const CELL_SIZE = 40;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
let randomcnt = 0;
let seen = 0;

// テトリスの形（回転を含む）
const TETRIS_SHAPES = [
  [[0, 0], [1, 0], [0, 1], [1, 1]], // 正方形
  [[0, 0], [1, 0], [2, 0], [3, 0]], // I字
  [[0, 0], [0, 1], [0, 2], [0, 3]], // 横I字
  [[0, 0], [1, 0], [1, 1], [2, 1]], // S字
  [[0, 0], [0, 1], [-1, 1], [-1, 2]], // 横S字
  [[0, 0], [1, 0], [-1, 1], [0, 1]], // Z字
  [[0, 0], [0, 1], [1, 1], [1, 2]], // 横Z字
  [[0, 0], [0, 1], [1, 1], [2, 1]], // L字
  [[0, 0], [0, 1], [0, 2], [-1, 2]], // L字
  [[0, 0], [1, 0], [2, 0], [2, 1]], // L字
  [[0, 0], [1, 0], [0, 1], [0, 2]], // L字
  [[0, 0], [0, 1], [0, 2], [1, 2]], // 逆L字
  [[0, 0], [0, 1], [-1, 1], [-2, 1]], // 逆L字
  [[0, 0], [1, 0], [1, 1], [1, 2]], // 逆L字
  [[0, 0], [0, 1], [1, 0], [2, 0]], // 逆L字
  [[0, 0], [1, 0], [2, 0], [1, 1]],  // T字
  [[0, 0], [0, 1], [0, 2], [1, 1]],  // T字
  [[0, 0], [-1, 1], [0, 1], [1, 1]],  // T字
  [[0, 0], [0, 1], [-1, 1], [0, 2]]  // T字
];

export function Konnan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
  let paint_char: number[][][] = [];
  const info = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  const player = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  let result: number[][] = [];
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスの初期設定
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // グリッド描画
    drawGrid(ctx);

    fillGrid(ctx);

    for (let i = 0; i < paint_char.length; i++) {
      let word = getRandomKonnan();
      for (let j = 0; j < 4; j++) {
        let newX = paint_char[i][j][0];
        let newY = paint_char[i][j][1];
        info[newX][newY] = word[j];
        ctx.fillStyle = 'white';
        ctx.font = `${CELL_SIZE * 0.6}px Arial`;
        ctx.fillText(word[j], newX * CELL_SIZE + CELL_SIZE * 0.1, newY * CELL_SIZE + CELL_SIZE * 0.75);
      }
    }
    // クリックイベント
    canvas.addEventListener('click', handleClick);

    return () => {
      // コンポーネントがアンマウントされるときにイベントリスナーをクリーンアップ
      canvas.removeEventListener('click', handleClick);
    };
    console.log("check");

  }, []);

  // グリッドを描画する関数
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.strokeStyle = 'white';
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  // ランダムな空マスを取得する関数
  const getRandomEmptyCell = () => {
    while (true) {
      const rand = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
      const x = Math.floor(rand / GRID_SIZE);
      const y = rand % GRID_SIZE;
      if (!grid[x][y]) {
        return { x, y };
      }
    }
  };

  // ランダムなテトリスの形を取得する関数
  const getRandomTetrisShape = () => {
    const shape = TETRIS_SHAPES[Math.floor(Math.random() * TETRIS_SHAPES.length)];
    return shape;
  };

  // 指定のマスにテトリスの形がはまるか確認する関数
  const canPlaceTetris = (x: number, y: number, shape: number[][]) => {
    return shape.every(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      return newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && !grid[newX][newY];
    });
  };

  // こ、ん、な、んをランダムに並び替える関数
  const getRandomKonnan = () => {
    const chars = ['こ', 'ん', 'な', 'ん'];
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  const fillGrid = (ctx: CanvasRenderingContext2D) => {
    randomcnt = 0;
    while (true) {
      const { x, y } = getRandomEmptyCell();
      const shape = getRandomTetrisShape();
      if (canPlaceTetris(x, y, shape)) {
        paint_char.push([]);
        shape.forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;
          grid[newX][newY] = true;
          randomcnt++;
          paint_char[paint_char.length - 1].push([newX, newY]);
        });
      } else {
        randomcnt++;
        if (randomcnt == 2000) break;
        continue;
      }
    }
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!grid[i][j]) fillCellWithWhite(ctx, i, j);
      }
    }
  };

  const fillCellWithWhite = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  };

  const fillCellWithLightWhite = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    let colors = ["rgba(255, 0, 0, 0.3)", "rgba(0, 0, 255, 0.3)", "rgba(0, 255, 0, 0.3)", "rgba(255, 255, 0, 0.3)", "rgba(255, 165, 0, 0.3)", "rgba(128, 0, 128, 0.3)", "rgba(255, 192, 203, 0.3)"];
    let usecolor = colors[Math.floor(Math.random() * colors.length)];
    if (result.length % 4 != 0)
      usecolor = player[result[result.length - 1][0]][result[result.length - 1][1]];
    ctx.fillStyle = usecolor;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    player[x][y] = usecolor;
    result.push([x, y]);
  };

  const paint_answer = () => {
    let colors = ["rgba(255, 0, 0, 0.3)", "rgba(0, 0, 255, 0.3)", "rgba(0, 255, 0, 0.3)", "rgba(255, 255, 0, 0.3)", "rgba(255, 165, 0, 0.3)", "rgba(128, 0, 128, 0.3)", "rgba(255, 192, 203, 0.3)"];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    for (let i = 0; i < paint_char.length; i++) {
      let usecolor = colors[Math.floor(Math.random() * colors.length)];
      for (let j = 0; j < 4; j++) {
        let newX = paint_char[i][j][0];
        let newY = paint_char[i][j][1];
        ctx.fillStyle = usecolor;
        if (seen == 0)
          ctx.strokeStyle = usecolor;
        else
          ctx.strokeStyle = 'rgba(0,0,0, 1)';
        ctx.lineWidth = 2;
        ctx.fillRect(newX * CELL_SIZE, newY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
    if (seen == 1) {
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // クリア
        ctx.fillStyle = 'black'; // 塗りつぶしの色を黒に設定
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // キャンバスを真っ黒に塗りつぶす
      }
      drawGrid(ctx);
      for (let i = 0; i < paint_char.length; i++) {
        for (let j = 0; j < 4; j++) {
          let newX = paint_char[i][j][0];
          let newY = paint_char[i][j][1];
          let word = info[newX][newY];
          ctx.fillStyle = 'white';
          ctx.font = `${CELL_SIZE * 0.6}px Arial`;
          ctx.fillText(word, newX * CELL_SIZE + CELL_SIZE * 0.1, newY * CELL_SIZE + CELL_SIZE * 0.75);
        }
      }
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (!grid[i][j]) {
            fillCellWithWhite(ctx, i, j);
          }
          player[i][j] = "";
        }
      }
    }
    seen = 1 - seen;
  }

  const distance = (xa: number, ya: number, xb: number, yb: number): number => {
    return Math.abs(xa - xb) + Math.abs(ya - yb);
  }

  const culc_score = () => {
    let ans = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    //resultから計算する
    for (let i = 0; i < result.length; i += 4) {
      let pos: number[][] = [];
      let str: string[] = [];
      for (let j = 0; j < 4; j++) {
        if (i + j >= result.length) break;
        pos.push(result[i + j]);
        str.push(info[result[i + j][0]][result[i + j][1]]);
      }
      str.sort();
      if (str[0] != "こ" || str[1] != "な" || str[2] != "ん" || str[3] != "ん") continue;
      //あとは連結だったらおっけい
      let nextcnt = 0;
      for (let j = 0; j < 4; j++) {
        for (let k = j + 1; k < 4; k++) {
          if (distance(pos[j][0], pos[j][1], pos[k][0], pos[k][1]) == 1) {
            nextcnt++;
          }
        }
      }
      if (nextcnt < 3) continue;
      ans++;

    }
    setScore(ans);
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // クリア
      ctx.fillStyle = 'black'; // 塗りつぶしの色を黒に設定
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // キャンバスを真っ黒に塗りつぶす
    }
    drawGrid(ctx);
    for (let i = 0; i < paint_char.length; i++) {
      for (let j = 0; j < 4; j++) {
        let newX = paint_char[i][j][0];
        let newY = paint_char[i][j][1];
        let word = info[newX][newY];
        ctx.fillStyle = 'white';
        ctx.font = `${CELL_SIZE * 0.6}px Arial`;
        ctx.fillText(word, newX * CELL_SIZE + CELL_SIZE * 0.1, newY * CELL_SIZE + CELL_SIZE * 0.75);
      }
    }
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!grid[i][j]) {
          fillCellWithWhite(ctx, i, j);
        }
        player[i][j] = "";
      }
    }



  }


  const handleClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // クリック位置を取得
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);

    // クリックされたマスの位置をコンソールに出力
    //console.log(`Clicked on cell: (${x}, ${y})`);
    if (player[x][y] != "") return;
    fillCellWithLightWhite(ctx, x, y);
  };


  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={paint_answer}>answer</button>
      <br />
      <button onClick={culc_score}>submit</button>
      <p>{score}</p>
    </div>
  );
}
