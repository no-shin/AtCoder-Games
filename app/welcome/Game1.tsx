import React, { useState, useEffect } from 'react';
import './Game1.css'; // CSSファイルをインポート

// 丸バツゲームを作る
export function Game1() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [board, setBoard] = useState<string[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('O');
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newCanvas = document.createElement('canvas');
      newCanvas.width = 300;
      newCanvas.height = 300;
      setCanvas(newCanvas);
      const newCtx = newCanvas.getContext('2d');
      setCtx(newCtx);

      // 盤面の初期化
      const initialBoard: string[][] = [];
      for (let i = 0; i < 3; i++) {
        initialBoard[i] = [];
        for (let j = 0; j < 3; j++) {
          initialBoard[i][j] = '';
        }
      }
      setBoard(initialBoard);
    }
  }, []);

  useEffect(() => {
    if (canvas && ctx) {
      drawBoard();
    }
  }, [board, canvas, ctx]);

  const drawBoard = () => {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const GRID_SIZE = 3;
    const CELL_SIZE = canvas.width / GRID_SIZE;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = j * CELL_SIZE;
        const y = i * CELL_SIZE;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        if (board[i][j] === 'O') {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 3, 0, 2 * Math.PI);
          ctx.fill();
        } else if (board[i][j] === 'X') {
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x + CELL_SIZE / 4, y + CELL_SIZE / 4);
          ctx.lineTo(x + CELL_SIZE * 3 / 4, y + CELL_SIZE * 3 / 4);
          ctx.moveTo(x + CELL_SIZE * 3 / 4, y + CELL_SIZE / 4);
          ctx.lineTo(x + CELL_SIZE / 4, y + CELL_SIZE * 3 / 4);
          ctx.stroke();
        }
      }
    }
  };

  const handleMouseClick = (event: React.MouseEvent) => {
    if (!canvas || winner || isDraw) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const i = Math.floor(y / (canvas.height / 3));
    const j = Math.floor(x / (canvas.width / 3));

    if (board[i][j] === '') {
      const newBoard = [...board];
      newBoard[i][j] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'O' ? 'X' : 'O');

      checkWinner(newBoard);
    }
  };

  const checkWinner = (currentBoard: string[][]) => {
    const lines = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        currentBoard[a[0]][a[1]] &&
        currentBoard[a[0]][a[1]] === currentBoard[b[0]][b[1]] &&
        currentBoard[a[0]][a[1]] === currentBoard[c[0]][c[1]]
      ) {
        setWinner(currentBoard[a[0]][a[1]]);
        return;
      }
    }

    // 引き分け判定
    if (currentBoard.flat().every((cell) => cell !== '')) {
      setIsDraw(true);
    }
  };

  const resetGame = () => {
    const initialBoard: string[][] = [];
    for (let i = 0; i < 3; i++) {
      initialBoard[i] = [];
      for (let j = 0; j < 3; j++) {
        initialBoard[i][j] = '';
      }
    }
    setBoard(initialBoard);
    setCurrentPlayer('O');
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="game-container">
      {canvas && (
        <canvas
          ref={(el) => {
            if (el) {
              setCanvas(el);
            }
          }}
          onClick={handleMouseClick}
        />
      )}
      <div className="game-info">
        {winner && <p>{winner} の勝ちです！</p>}
        {isDraw && <p>引き分けです！</p>}
        <button onClick={resetGame}>リセット</button>
      </div>
    </div>
  );
}
