import { Letter } from "./letter.js";

type BoardRow = [Letter, Letter, Letter];

type Board = [BoardRow, BoardRow, BoardRow];

export class Generator {
  #board: Board;
  #boardSize: number = 3;

  constructor() {
    this.#board = this.#createBoard();
  }

  #createBoard() {
    const board: Board = [null!, null!, null!];
    for (let rowIndex = 0; rowIndex < this.#boardSize; rowIndex++) {
      const row: BoardRow = [null!, null!, null!];
      for (let colIndex = 0; colIndex < this.#boardSize; colIndex++) {
        const letter = new Letter(`${rowIndex}${colIndex}`);
        row.push(letter);
      }
      board.push(row);
    }
    return board;
  }

  get board(): Board {
    return this.#board;
  }

  get wordsInBoard(): string[] {
    const words: string[] = [];

    for (let i = 0; i < this.#boardSize; i++) {
      const rowWord = this.#board[i].map(letter => letter.value).join("");
      let colWord = "";

      // loop through rows to get each letter in a colWord
      for (const row of this.#board) {
        const letter = row.map(letter => letter.value)[i];
        if (letter) colWord += letter;
      }

      if (rowWord.length === this.#boardSize) words.push(rowWord);
      if (colWord.length === this.#boardSize) words.push(colWord);
    }

    return words;
  }
}
