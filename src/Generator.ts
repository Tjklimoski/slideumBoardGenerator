import type { Letter } from "./Letter";
import { Board } from "./Board";

type ResultMatrix = string[][];

interface convertedCoord {
  coord: string;
  rowIndex: number;
  colIndex: number;
}

export class Generator {
  // wordsInBoard is a getter function
  #size: number;
  #history: string[];
  #board: Board;

  constructor(size: number = 3) {
    this.#size = size;
    this.#history = [];
    this.#board = new Board(this.#size);
  }

  async getBoard(): Promise<ResultMatrix> {
    // if there's an unresolved value in board, call generate
    if (this.#board.board.flat().some(letter => letter.value === undefined)) {
      await this.generate();
    }
    const result = this.#board.board.map(row =>
      // passing as string to TS since it doesn't see the type check for undefined above
      row.map(letter => letter.value as string)
    );
    return result;
  }

  async generate(): Promise<ResultMatrix> {
    // logic to run to generate one board
    // returns a matrix of values.
    let done = false;

    while (!done) {
      // Check for a possibleLetterCount of 0
      const selectedLetter = this.#selectLetter();
      this.#assignValue(selectedLetter);
      if (this.#board.hasDuplicateWord) {
        // revert last letter value assigned, restart loop
        this.#revert();
        continue;
      }
      done = this.#isComplete();
      // calculate possible letters for all letters with undefined values
    }

    // getBoard is the board with just the values, no Letter objects.
    return await this.getBoard();
  }

  #selectLetter(): Letter {
    // method to select which letter on the board to assign a value to next
    const lastMoveInHistory: string | undefined =
      this.#history[this.#history.length - 1];
    if (lastMoveInHistory !== undefined) {
      const { rowIndex, colIndex } =
        this.#validateAndConvertCoord(lastMoveInHistory);
      const letter = this.#board.board[rowIndex][colIndex];
      // If last letter in history still has an undefined value, select it again
      if (letter.value === undefined) return letter;
    }
    return this.#selectRandomLetterFrom(
      this.#lettersWithLowestPossibleLettersCount
    );
  }

  get #lettersWithLowestPossibleLettersCount(): Letter[] {
    return (
      this.#board.board
        .flat()
        // sort will mutate the array created by .flat(). Will not mutate this.#board.board
        .sort((a, b) => a.possibleLettersCount - b.possibleLettersCount)
        .reduce((array: Letter[], letter, i) => {
          if (i === 0 || letter.value === array[0].value) array.push(letter);
          return array;
        }, [])
    );
  }

  #selectRandomLetterFrom(letterArray: Letter[]): Letter {
    const letter = letterArray[Math.floor(Math.random() * letterArray.length)];
    if (!letter) throw new Error("No letter found in array passed");
    return letter;
  }

  #assignValue(letter: Letter): void {
    letter.assignValue_Random();
    if (this.#history.includes(letter.coord)) return;
    this.#history.push(letter.coord);
  }

  #isComplete(): boolean {
    // if conditions are true, board is complete.
    if (
      this.#history.length === this.#size ** 2 &&
      this.#board.board.flat().every(letter => letter.value !== undefined) &&
      this.#board.getCompletedWords.length === this.#size * 2
    )
      return true;
    return false;
  }

  #calculatePossibleLetters() {
    // for all letters with no value, use this.#board.getTargetWords(coord)
    // determine dict to use (str.search(/\w/i)) and letter.
    // binary search -- break out into own method for clarity.
    // set possibleLetters array based on value of col and row possible letters that match.
    // use promises and promise.all() to run binary search in parallel
  }

  #handleCountOf0() {}

  #revert() {
    const { rowIndex, colIndex } = this.#validateAndConvertCoord(
      this.#history[this.#history.length - 1]
    );
    this.#board.board[rowIndex][colIndex].revert();
  }

  #validateAndConvertCoord(coord: string): convertedCoord {
    if (coord.length !== 2 || isNaN(parseInt(coord)))
      throw new Error("coord must be 2 numerical digits long");

    const rowIndex = parseInt(coord[0]);
    const colIndex = parseInt(coord[1]);

    if (rowIndex >= this.#size || colIndex >= this.#size)
      throw new Error(
        `coordinate values [${rowIndex}, ${colIndex}] can not be greater than board size ${
          this.#size
        }`
      );

    return { coord, rowIndex, colIndex };
  }
}
