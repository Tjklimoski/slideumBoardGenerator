import type { Letter } from "./Letter";
import { Board } from "./Board";
import dict from "./dict/dict";
import type { Dictionary, IndexedDict } from "./dict/dict";

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
      return await this.generate();
    }
    const result: ResultMatrix = this.#board.board.map(row =>
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
      if (this.#board.hasPossibleLettersCountOfZero) {
        this.#handleCountOfZero();
        continue;
      }
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
    if (this.#lastMoveInHistory !== undefined) {
      const { rowIndex, colIndex } = this.#validateAndConvertCoord(
        this.#lastMoveInHistory
      );
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

  #assignValue(letter: Letter) {
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

  async #calculatePossibleLetters() {
    // break out into own method, letterFinder for clarity:
    // determine dict to use (str.search(/\w/i)) and letter.
    // binary search -- break out into own method for clarity.

    // Get all letters that have an undefined value
    const LettersToCalculate = this.#board.board
      .flat()
      .filter(letter => letter.value === undefined);

    for (let i = 0; i < LettersToCalculate.length; i++) {
      const letter = LettersToCalculate[i];

      const { row: rowWord, col: colWord } = this.#board.getTargetWords(
        letter.coord
      );
      // this index position should be blank in the coresponding target word
      const { rowIndex, colIndex } = this.#validateAndConvertCoord(
        letter.coord
      );

      const rowLetterFinder = this.#letterFinder(rowWord, rowIndex);
      const colLetterFinder = this.#letterFinder(colWord, colIndex);

      try {
        // if a promise finished with an empty set, it would reject.
        const [rowSet, colSet] = await Promise.all([
          rowLetterFinder,
          colLetterFinder,
        ]);

        const [rowArray, colArray] = [Array(...rowSet), Array(...colSet)];
        const possibleLetters = rowArray.filter(letter =>
          colArray.includes(letter)
        );

        if (possibleLetters.length === 0)
          throw new Error("No letters shared between rowArray and colArray");

        letter.possibleLetters = possibleLetters;
      } catch (err) {
        // a promise finished with an empty set
        // or no letters shared between rowArray and colArray
        letter.possibleLetters = [];
      }
    }
  }

  #letterFinder(word: string, index: number): Promise<Set<string>> {
    // A promise that will return a set of possible letters for the specified index, based on the partial word passed in.
    return new Promise((res, rej) => {
      // using Set to prevent duplicate letters
      const set: Set<string> = new Set();

      if (word[index] !== " ") rej("Incorrect index or word passed");

      const firstLetterIndex = word.search(/\w/i);
      if (firstLetterIndex >= this.#size) rej("Incorrrect word passed");
      const dictPositionKey = `_${firstLetterIndex}` as keyof Dictionary;
      const dictLetterKey = word[
        firstLetterIndex
      ].toLowerCase() as keyof IndexedDict;

      // build regex string for matcher.
      // " " = \w{1} -- \b at end to only match full words.
      // /i for case insensitive
      // "  a" --> /\w{1}\w{1}a\b/i
      // "ba " --> /ba\w{1}\b/i
      const regexWord = new RegExp(
        word.replaceAll(/\s/g, "\\w{1}") + "\\b",
        "i"
      );

      // select dictionary and loop over included words
      dict[dictPositionKey][dictLetterKey].forEach(word => {
        if (word.match(regexWord)) set.add(word[index].toLowerCase());
      });

      if (set.size > 0) {
        res(set);
      } else {
        rej(`No matches found for partial word ${word}`);
      }
    });
  }

  #handleCountOfZero() {
    if (this.#lastMoveInHistory === undefined) {
      throw new Error("No move in history");
    }

    const { rowIndex, colIndex } = this.#validateAndConvertCoord(
      this.#lastMoveInHistory
    );

    if (this.#board.board[rowIndex][colIndex].possibleLettersCount === 0) {
      // if conditioln is true, that letter has a value of undefined
      // only need to remove it from history to revert prior letter
      this.#history.pop();
    }

    this.#revert();
  }

  #revert() {
    if (this.#lastMoveInHistory === undefined)
      throw new Error("No move in history to revert");

    const { rowIndex, colIndex } = this.#validateAndConvertCoord(
      this.#lastMoveInHistory
    );
    // revert method on Letter removes the current value from the possibleLetters array, and sets value to undefined
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

  get #lastMoveInHistory(): string | undefined {
    return this.#history[this.#history.length - 1];
  }
}
