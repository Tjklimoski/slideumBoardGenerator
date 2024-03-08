import { Letter } from "./Letter";

type BoardRow = [Letter, Letter, Letter];

type BoardType = [BoardRow, BoardRow, BoardRow];

interface AllWords {
  rows: string[];
  cols: string[];
}

interface TargetWords {
  rowWord: string;
  colWord: string;
}

export class Board {
  #board: BoardType;
  #boardSize: 3 | 4 | 5;

  constructor(size: 3 | 4 | 5 = 3) {
    this.#boardSize = size;
    this.#board = this.#createBoard();
  }

  #createBoard() {
    const board: BoardType = [null!, null!, null!];
    for (let rowIndex = 0; rowIndex < this.#boardSize; rowIndex++) {
      const row: BoardRow = [null!, null!, null!];
      for (let colIndex = 0; colIndex < this.#boardSize; colIndex++) {
        const letter = new Letter(`${rowIndex}${colIndex}`, this.#boardSize);
        row[colIndex] = letter;
      }
      board[rowIndex] = row;
    }
    return board;
  }

  get board(): BoardType {
    return this.#board;
  }

  allWords(): AllWords {
    const letters: Letter[] = this.#board.flat();
    const words: AllWords = {
      rows: [],
      cols: [],
    };

    for (let i = 0; i < this.#boardSize; i++) {
      const startingRowIndex = i * this.#boardSize;
      const startingColIndex = i;

      let rowWord = "";
      let colWord = "";

      for (let j = 0; j < this.#boardSize; j++) {
        rowWord += letters[startingRowIndex + j].value ?? " ";
        colWord += letters[startingColIndex + j * this.#boardSize].value ?? " ";
      }

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

  get hasPossibleLettersCountOfZero(): boolean {
    return this.#board.flat().some(letter => letter.possibleLettersCount === 0);
  }

  getTargetWords(targetLetter: Letter): TargetWords {
    const allWords = this.allWords();

    return {
      rowWord: allWords.rows[targetLetter.rowIndex],
      colWord: allWords.cols[targetLetter.colIndex],
    };
  }
}
