import React from 'react';

function Game() {
  const [squares, setSquares] = React.useState<SquareVal[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = React.useState(true);

  function handlePlay(squares: SquareVal[]) {
    setSquares(squares);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} />
      </div>
    </div>
  )
}

type SquareVal = 'X' | 'O' | null;

interface BoardProps {
  xIsNext: boolean;
  squares: SquareVal[];
  onPlay: (squares: SquareVal[]) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {

  function handleClick(i: number) {
    if (squares[i] !== null) {
      return;
    }
    let copy = squares.slice();
    copy[i] = xIsNext ? 'X' : 'O';
    onPlay(copy);
  }

  let status = xIsNext ? 'Next: X' : 'Next: O';

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

interface SquareProps {
  'value': SquareVal;
  'onSquareClick': () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button onClick={onSquareClick}>{value ?? '\u00A0'}</button>
  );
}

function calculateWinner(squares: SquareVal[]): SquareVal {



  export default Game;
