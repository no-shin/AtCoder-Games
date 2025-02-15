import React, { useState, useEffect, useRef } from 'react';
import './game1.css';

export function Game1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [board, setBoard] = useState<string[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('O');
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>('ゲーム開始');

  useEffect(() => {
    if (canvasRef.current) {
      const newCtx = canvasRef.current.getContext('2d');
      setCtx(newCtx);

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
    if (ctx) {
      drawBoard();
    }
  }, [board, ctx]);

  const drawBoard = () => {
    if (!ctx || !canvasRef.current) return;

    const canvasWidth = 300;
    const canvasHeight = 300;
    canvasRef.current.width = canvasWidth;
    canvasRef.current.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const GRID_SIZE = 3;
    const CELL_SIZE = canvasWidth / GRID_SIZE;

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
          ctx.fillStyle = 'blue';
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };

  const handleMouseClick = (event: React.MouseEvent) => {
    if (!ctx || winner || isDraw) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const i = Math.floor(y / (canvas.height / 3));
    const j = Math.floor(x / (canvas.width / 3));

    if (board[i][j] === '') {
      const newBoard = [...board];
      newBoard[i][j] = currentPlayer;
      setBoard(newBoard);

      if (checkWinner(newBoard) == null && !isDraw) {
        aiTurn(newBoard);
      }
    }
  };

  const checkWinner = (currentBoard: string[][]): boolean => {
    const lines = [
      [[0, 0],[0, 1],[0, 2],],
      [[1, 0],[1, 1],[1, 2],],
      [[2, 0],[2, 1],[2, 2],],
      [[0, 0],[1, 0],[2, 0],],
      [[0, 1],[1, 1],[2, 1],],
      [[0, 2],[1, 2],[2, 2],],
      [[0, 0],[1, 1],[2, 2],],
      [[0, 2],[1, 1],[2, 0],],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        currentBoard[a[0]][a[1]] &&
        currentBoard[a[0]][a[1]] === currentBoard[b[0]][b[1]] &&
        currentBoard[a[0]][a[1]] === currentBoard[c[0]][c[1]]
      ) {
        setWinner(currentBoard[a[0]][a[1]]);
        setGameStatus(currentBoard[a[0]][a[1]] + 'の勝ち！');
        return currentBoard[a[0]][a[1]];
      }
    }

    if (currentBoard.flat().every((cell) => cell !== '')) {
      setIsDraw(true);
      setGameStatus('引き分け！');
    }
  };

  const aiTurn = (currentBoard: string[][]) => {
    const aiMove = getAiMove(currentBoard);
    if (aiMove) {
      const newBoard = [...currentBoard];
      newBoard[aiMove.i][aiMove.j] = 'X';
      setBoard(newBoard);
      drawBoard();
      checkWinner(newBoard);
    }
  };

  const getAiMove = (currentBoard: string[][]) => {
    const availableMoves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === '') {
          availableMoves.push({ i, j });
        }
      }
    }

    if (availableMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }

    return null;
  };

  const handleReset = () => {
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
    setGameStatus('ゲーム開始');
  };

  return (
    <div className="game-container">
      <canvas ref={canvasRef} onClick={handleMouseClick} />
      <div className="button-container">
        <button onClick={handleReset}>リセット</button>
      </div>
      <p>{gameStatus}</p>
    </div>
  );
}
