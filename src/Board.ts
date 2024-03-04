import { Letter } from "./letter.js";

type BoardRow = [Letter, Letter, Letter];

type BoardType = [BoardRow, BoardRow, BoardRow];

interface AllWords {
  rows: string[];
  cols: string[];
}

interface TargetWords {
  row: string;
  col: string;
}

export class Board {
  #board: BoardType;
  #boardSize: number;

  constructor(size: number = 3) {
    this.#boardSize = size;
    this.#board = this.#createBoard();
  }

  #createBoard() {
    const board: BoardType = [null!, null!, null!];
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

  get board(): BoardType {
    return this.#board;
  }

  allWords(): AllWords {
    const letters: string[] = this.#board
      .flat()
      .map(letter => (letter.value ? letter.value : " "));
    const words: AllWords = {
      rows: [],
      cols: [],
    };

    for (let i = 0; i < this.#boardSize; i++) {
      const startingRowIndex = i * 3;
      const startingColIndex = i;

      let rowWord =
        letters[startingRowIndex] +
        letters[startingRowIndex + 1] +
        letters[startingRowIndex + 2];
      let colWord =
        letters[startingColIndex] +
        letters[startingColIndex + 1 * this.#boardSize] +
        letters[startingColIndex + 2 * this.#boardSize];

      words.rows[i] = rowWord;
      words.cols[i] = colWord;
    }

    return words;
  }

  get getCompletedWords(): string[] {
    const allWords = this.allWords();

    return [...allWords.rows, ...allWords.cols].filter(
      word => word.trim().length === this.#boardSize
    );
  }

  get hasDuplicateWord(): boolean {
    const words = this.getCompletedWords;
    return words.some(
      word => words.filter(filterWord => filterWord === word).length > 1
    );
  }

  getTargetWords(targetCoords: string): TargetWords {
    if (targetCoords.length !== 2 || isNaN(parseInt(targetCoords)))
      throw new Error("coord must be 2 numerical digits long");

    const rowIndex = parseInt(targetCoords[0]);
    const colIndex = parseInt(targetCoords[1]);

    if (rowIndex >= this.#boardSize || colIndex >= this.#boardSize)
      throw new Error(
        `coordinate values ${rowIndex}, ${colIndex} can not be greater than board size ${
          this.#boardSize
        }`
      );

    const allWords = this.allWords();

    return {
      row: allWords.rows[rowIndex],
      col: allWords.cols[colIndex],
    };
  }
}
