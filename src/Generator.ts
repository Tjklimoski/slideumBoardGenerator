import { Letter } from "./letter.js";

type BoardRow = [Letter, Letter, Letter];

type Board = [BoardRow, BoardRow, BoardRow];

export class Generator {
  // wordsInBoard is a getter function
  #history: string[];
  #board: Board;

  constructor() {
    this.#history = [];
    this.#board = this.#createBoard();
  }

  #createBoard() {
    const board: Board = [null!, null!, null!];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const row: BoardRow = [null!, null!, null!];
      for (let colIndex = 0; colIndex < 3; colIndex++) {
        const letter = new Letter(`${rowIndex}${colIndex}`);
        row.push(letter);
      }
      board.push(row);
    }
    return board;
  }
}
