import React, { useState } from "react";

const Game1 = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">マルバツゲーム</h2>
      <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
        {board.map((value, index) => (
          <button 
            key={index} 
            className="w-12 h-12 border flex items-center justify-center text-2xl"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      {winner && <p className="mt-2 font-bold">勝者: {winner}</p>}
    </div>
  );
};

export default Game1;
