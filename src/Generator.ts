import type { Letter } from "./Letter";
import { Board } from "./Board";

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

  get getBoard(): matrix {
    // if there's an undefined letter.value in this.#board, run generate method
    // else, reduce letters in array to just their values and return new matrix
  }

  generate() {
    // logic to run to generate one board
    // returns a matrix of values.
    let isDone = false;
    while (isDone) {
      // steps
      isDone = this.#isComplete();
      // steps
    }
    // getBoard is the baord with just the values, no Letter objs.
    return this.#getBoard;
  }

  #selectLetter(): Letter {
    // method to select which letter on the board to assign a value to next
  }

  #getLowestPossibleLettersCount(): Letter {
    // loop over this.#board.board.flat() and check the letter.possibleLettersCount property
  }

  #assignValue(letter: Letter) {}

  #handleDuplicateWord() {
    this.#board.hasDuplicateWord;
  }

  #isComplete(): boolean {
    // check if history length === this.#size**2
    // check that all tiles have a value
    // check that this.#board.getCompletedWords.length === this.#size * 2
    // If all above is true, board is complete. return true
    return false;
  }

  #calculatePossibleLetters() {
    // for all letters with no value, use this.#board.getTargetWords(coord)
    // determine dict to use (str.search(/\w/i)) and letter.
    // binary search -- break out into own method for clarity.
    // set possibleLetters array based on value of col and row possible letters that match.
    // use promises and promise.all() to run binary search in parallel
  }

  #revert() {
    // method to remove the last value set on a letter, and to restart loop
    const coord = this.#history[this.#history.length - 1];
    const rowIndex = parseInt(coord[0]);
    const colIndex = parseInt(coord[1]);
    this.#board.board[rowIndex][colIndex].revert();
  }
}
