import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

let winningPatternLength = 4;
let sizeOfBoard = 10;

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderRows() {
    const columns = [];
    for (let rowNo = 0; rowNo < sizeOfBoard; rowNo++) {
      columns.push(<div className="board-row">{this.renderRow(rowNo)}</div>);
    }
    return columns;
  }

  renderRow(rowNo) {
    const squares = [];
    for (let columnNo = 0; columnNo < sizeOfBoard; columnNo++) {
      squares.push(this.renderCell(rowNo, columnNo));
    }
    return squares;
  }

  renderCell(rowNo, columnNo) {
    return (
      <Square
        value={this.props.squares[rowNo][columnNo]}
        onClick={() => this.props.onClick(rowNo, columnNo)}
      />
    );
  }

  render() {
    return <div>{this.renderRows()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    var boardArray = [];
    for (let i = 0; i < sizeOfBoard; i++) {
      boardArray.push(new Array(sizeOfBoard).fill(null));
    }
    this.state = {
      history: [{ squares: boardArray }],
      isXNext: true,
      stepNumber: 0
    };
  }

  handleClick(rowNo, columnNo) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (doWeHaveWinner(squares) || squares[rowNo][columnNo]) {
      return;
    }
    squares[rowNo][columnNo] = this.state.stepNumber % 2 === 0 ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step
      //xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = this.state.history[this.state.stepNumber];
    const winner = doWeHaveWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.stepNumber % 2 === 0 ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(row, column) => this.handleClick(row, column)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

const isRowWinner = (squares) => {
  for (let row = 0; row < sizeOfBoard; row++) {
    for (
      let compareColumn = 0;
      compareColumn <= sizeOfBoard - winningPatternLength;
      compareColumn++
    ) {
      if (!squares[row][compareColumn]) {
        continue;
      }
      let rowFullfilled = true;
      for (
        let column = compareColumn + 1;
        column < compareColumn + winningPatternLength;
        column++
      ) {
        if (squares[row][compareColumn] !== squares[row][column]) {
          rowFullfilled = false;
          break;
        }
      }
      if (rowFullfilled) return squares[row][compareColumn];
    }
  }
  return null;
};

const isColumnWinner = (squares) => {
  for (let column = 0; column < sizeOfBoard; column++) {
    for (
      let compareRow = 0;
      compareRow <= sizeOfBoard - winningPatternLength;
      compareRow++
    ) {
      if (!squares[compareRow][column]) {
        continue;
      }
      let columnFullfilled = true;
      for (
        let row = compareRow + 1;
        row < compareRow + winningPatternLength;
        row++
      ) {
        if (squares[compareRow][column] !== squares[row][column]) {
          columnFullfilled = false;
          break;
        }
      }
      if (columnFullfilled) return squares[compareRow][column];
    }
  }
  return null;
};

const isDiagonalPatternFullfilled = (squares) => {
  console.log("squares:", squares);
  for (
    let comparedColumn = 0;
    comparedColumn <= sizeOfBoard - winningPatternLength;
    comparedColumn++
  ) {
    for (
      let comparedRow = 0;
      comparedRow <= sizeOfBoard - winningPatternLength;
      comparedRow++
    ) {
      console.log(
        "compared row and column",
        comparedRow,
        comparedColumn,
        squares[comparedRow][comparedColumn]
      );
      if (!squares[comparedRow][comparedColumn]) {
        console.log("Continue");
        continue;
      }
      let diagonalFullfilled = true;
      for (let index = 1; index < winningPatternLength; index++) {
        console.log(
          "checking",
          comparedRow + index,
          comparedColumn + index,
          squares[comparedRow + index][comparedColumn + index]
        );
        if (
          squares[comparedRow][comparedColumn] !==
          squares[comparedRow + index][comparedColumn + index]
        ) {
          diagonalFullfilled = false;
          console.log("breaking for row column");
          break;
        }
      }
      if (diagonalFullfilled) return squares[comparedRow][comparedColumn];
    }
  }
  return null;
};

const isCrossDiagonalPatternFullfilled = (squares) => {
  console.log("squares:", squares);
  for (
    let comparedColumn = sizeOfBoard;
    comparedColumn >= sizeOfBoard - winningPatternLength;
    comparedColumn--
  ) {
    for (
      let comparedRow = 0;
      comparedRow <= sizeOfBoard - winningPatternLength;
      comparedRow++
    ) {
      console.log(
        "compared row and column",
        comparedRow,
        comparedColumn,
        squares[comparedRow][comparedColumn]
      );
      if (!squares[comparedRow][comparedColumn]) {
        console.log("Continue");
        continue;
      }
      let diagonalFullfilled = true;
      for (let index = 1; index < winningPatternLength; index++) {
        console.log(
          "checking",
          comparedRow + index,
          comparedColumn - index,
          squares[comparedRow + index][comparedColumn - index]
        );
        if (
          squares[comparedRow][comparedColumn] !==
          squares[comparedRow + index][comparedColumn - index]
        ) {
          diagonalFullfilled = false;
          console.log("breaking for row column");
          break;
        }
      }
      if (diagonalFullfilled) return squares[comparedRow][comparedColumn];
    }
  }
  return null;
};

const doWeHaveWinner = (squares) => {
  let winner = isRowWinner(squares);
  if (winner) {
    console.log("ROW fullfilled");
    return winner;
  }
  winner = isColumnWinner(squares);
  if (winner) {
    console.log("column fullfilled");
    return winner;
  }
  winner = isDiagonalPatternFullfilled(squares);
  if (winner) {
    console.log("diagonal fullfilled");
    return winner;
  }
  winner = isCrossDiagonalPatternFullfilled(squares);
  if (winner) {
    console.log("cross diagonal fullfilled");
    return winner;
  }
  return null;
};

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
