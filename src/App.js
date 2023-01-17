import { useState } from "react";

const emptyCell = "";

function emptyRow(size){
  const row = [];
  for(let i=0; i < size; i++){
    row[i] = emptyCell;
  }
  return row;
}

function emptyBoard(size){
  const board = [];
  for(let i=0; i < size; i++){
    board[i] = emptyRow(size);
  }
  return board;
}

function winnerOfRow(row){
  const first = row[0];
  return row.reduce((winner, nextCell) => (winner === emptyCell || winner !== nextCell)? emptyCell: winner , first);
}

function winnerOfRows(rows){
  const first = emptyCell;
  return rows.reduce((winner, nextRow) => (winner === emptyCell) ? winnerOfRow(nextRow) : winner , first);
}

function calculateWinner(rows){
  let winner = winnerOfRows(rows);
  if (winner !== emptyCell){
    return winner;
  }
  const cols = emptyBoard(rows.length);
  for(let j = 0; j < rows.length; j ++){
    cols[j] = Array(rows.length).fill("");
    for(let i = 0; i < rows[j].length; i ++){
      cols[j][i] = rows[i][j];
    }
  }
  winner = winnerOfRows(cols);
  if (winner !== emptyCell){
    return winner;
  }
  const diags = [];
  diags[0] = emptyRow(rows.length);
  diags[1] = emptyRow(rows.length);
  for(let k = 0; k < rows.length; k ++){
    diags[0][k] = rows[k][k];
    diags[1][k] = rows[k][rows.length - k - 1];
  }
  winner = winnerOfRows(diags);
  return winner;
}

function Square({ value, onSquareClick }) {

  return (
    <button 
      className="square"
      onClick={onSquareClick}
    > 
      {value} 
    </button>
  )
}

function BoardRow({ squares, onRowClick }){
  return(
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => onRowClick(0)} />
      <Square value={squares[1]} onSquareClick={() => onRowClick(1)} />
      <Square value={squares[2]} onSquareClick={() => onRowClick(2)} />
    </div>
  );
}

function Board({ xIsNext, rows, onPlay }) {
  const winner = calculateWinner(rows);
  const status = (winner !== emptyCell) ? 
    "Winner is: " + winner : 
    "Next player: " + (xIsNext? "X": "O")

  function handleBoardClick(row, col){
    const test = rows[row][col];
    if (winner === emptyCell){
        if (test == null || test === emptyCell){
        const nextRows = rows.slice();
        nextRows[row] = rows[row].slice();
        nextRows[row][col] = xIsNext? "X" : "O";
        onPlay(nextRows);
      }
    }
  }
  
  return (
    <>
      <div className="status">{status}</div>
      <BoardRow squares={rows[0]} onRowClick={(col) => handleBoardClick(0, col)} />
      <BoardRow squares={rows[1]} onRowClick={(col) => handleBoardClick(1, col)} />
      <BoardRow squares={rows[2]} onRowClick={(col) => handleBoardClick(2, col)} />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([emptyBoard(3)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentRows = history[currentMove];
  const moveList = history.map(
    (rows, index) => {
      const description = "Go to " + (index > 0 ?
        "move #" + index :
        "start of game");
      return (
        <li key={index} >
          <button onClick={() => gotoHistory(index)} >
            {description}
          </button>
        </li>
      );
    }
  );

  function handlePlay(nextRows){
    const updatedHistory = [ ...history.slice(0, currentMove + 1), nextRows];
    setHistory(updatedHistory);
    setCurrentMove(updatedHistory.length - 1);
  }

  function gotoHistory(index){
    setCurrentMove(index);
  }

  return (
    <div className="game" >
      <div className="game-board" >
        <Board 
          xIsNext={xIsNext}
          rows={currentRows}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info" >
        <ol> {moveList} </ol>
      </div>
    </div>
  );
}