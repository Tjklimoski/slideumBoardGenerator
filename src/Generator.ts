import type { Letter } from "./Letter";
import { Board } from "./Board";
import dict from "./dict/dict";
import type { Dictionary, IndexedDict } from "./dict/dict";

export type ResultMatrix = string[][];

interface convertedCoord {
  coord: string;
  rowIndex: number;
  colIndex: number;
}

export class Generator {
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

    return this.#board.board.map(row =>
      // passing "as string" to TS since it doesn't see the type check for undefined above
      row.map(letter => letter.value as string)
    );
  }

  async generate(): Promise<ResultMatrix> {
    let done = false;
    let count = 0;

    while (!done) {
      // ***UNCOMMENT CODE BELOW TO SEE PROGRAM BUILD BOARD STEP BY STEP:***
      // count++;
      // console.log(`BOARD @ STEP ${count}:`);
      // this.#board.board.forEach(row =>
      //   console.log(row.map(letter => (letter.value ? letter.value : " ")))
      // );

      if (this.#board.hasPossibleLettersCountOfZero) {
        this.#handleCountOfZero();
        continue;
      }
      this.#assignValue(this.#selectLetter());
      if (this.#board.hasDuplicateWord) {
        this.#revert();
        continue;
      }
      done = this.#isComplete();
      await this.#calculatePossibleLetters();
    }

    // returns board with just the values, no Letter objects:
    return await this.getBoard();
  }

  #selectLetter(): Letter {
    if (this.#lastMoveInHistory) {
      const { rowIndex, colIndex } = this.#validateAndConvertCoord(
        this.#lastMoveInHistory
      );
      const letter = this.#board.board[rowIndex][colIndex];
      // If last letter in history still has an undefined value, select it again
      if (!letter.value) return letter;
    }
    return this.#selectRandomLetterFrom(
      this.#lettersWithLowestPossibleLettersCount
    );
  }

  get #lettersWithLowestPossibleLettersCount(): Letter[] {
    return this.#board.board.flat().reduce((array: Letter[], letter) => {
      // don't include letters with values
      if (letter.value) return array;

      if (
        array.length === 0 ||
        letter.possibleLettersCount === array[0].possibleLettersCount
      ) {
        array.push(letter);
      }

      if (letter.possibleLettersCount < array[0].possibleLettersCount) {
        // letter with an even lower count? Replace array with new letter
        array = [letter];
      }
      return array;
    }, []);
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
    if (
      this.#history.length === this.#size ** 2 &&
      this.#board.board.flat().every(letter => letter.value) &&
      this.#board.getCompletedWords.length === this.#size * 2
    )
      return true;
    return false;
  }

  async #calculatePossibleLetters() {
    const undefinedLetters = this.#board.board
      .flat()
      .filter(letter => letter.value === undefined);

    for (let i = 0; i < undefinedLetters.length; i++) {
      const letter = undefinedLetters[i];

      const { row: rowWord, col: colWord } = this.#board.getTargetWords(
        letter.coord
      );
      const { rowIndex, colIndex } = this.#validateAndConvertCoord(
        letter.coord
      );

      // rowWord needs the letters in the COL index position
      // colWord needs the letters in the ROW index position
      const rowLetterFinder = this.#letterFinder(rowWord, colIndex);
      const colLetterFinder = this.#letterFinder(colWord, rowIndex);

      let possibleLetters: string[] = [];

      try {
        // if a promise finishes with an empty set, it rejects
        const [rowSet, colSet] = await Promise.all([
          rowLetterFinder,
          colLetterFinder,
        ]);

        const [rowArray, colArray] = [Array(...rowSet), Array(...colSet)];
        const sharedLetters = rowArray.filter(letter =>
          colArray.includes(letter)
        );

        if (sharedLetters.length === 0)
          throw new Error("No letters shared between rowArray and colArray");

        possibleLetters = sharedLetters;
      } catch (err) {
        // NON CRITICAL ERRORS, NO NEED TO RETHROW OR HANDLE
        // letterFinder finished with an empty set and rejected OR
        // there were no shared letters between to col word and row word
      } finally {
        letter.possibleLetters = possibleLetters;
      }
    }
  }

  #letterFinder(word: string, index: number): Promise<Set<string>> {
    // A promise that will return a set of possible letters for the specified index, based on the partial word passed in.
    return new Promise((res, rej) => {
      // using Set to prevent duplicate letters
      const set: Set<string> = new Set();

      if (word[index] !== " ") rej(new Error("Incorrect index or word passed"));

      const firstLetterIndex = word.search(/\w/i);
      // firstLetterIndex set to -1 when no letters in word. ex: "   "
      // add full alphabet to set and resolve promise:
      if (firstLetterIndex === -1) {
        "abcdefghijklmnopqrstuvwxyz"
          .split("")
          .forEach(letter => set.add(letter));
        res(set);
      }

      if (firstLetterIndex >= this.#size)
        rej(new Error("Incorrrect word passed"));
      const dictPositionKey = `_${firstLetterIndex}` as keyof Dictionary;
      const dictLetterKey = word[
        firstLetterIndex
      ].toLowerCase() as keyof IndexedDict;

      // build regex string for matcher.
      // " " = \w{1} -- match any letter that's 1 ch long
      // \b -- placed at end, to only match full words.
      // /i -- flag for case insensitive
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
        rej(new Error(`No matches found for partial word ${word}`));
      }
    });
  }

  #handleCountOfZero() {
    // If last move in history has a zero count, remove it from history
    if (!this.#lastMoveInHistory) return;
    const { rowIndex, colIndex } = this.#validateAndConvertCoord(
      this.#lastMoveInHistory
    );
    if (this.#board.board[rowIndex][colIndex].possibleLettersCount === 0) {
      this.#history.pop();
    }

    // reset ALL letters with a 0 count to a new full alphabet.
    // prevents this.#board.hasPossibleLettersCountOfZero returning true again after restarting loop.
    // Also prevents lettersWithLowestPossibleLettersCount returning an array of letters with 0 counts when selecting a letter to assign a value to
    this.#lettersWithLowestPossibleLettersCount.forEach(letter => {
      letter.possibleLetters = "abcdefghijklmnopqrstuvwxyz".split("");
    });

    this.#revert();
  }

  #revert() {
    if (!this.#lastMoveInHistory) return;

    const { rowIndex, colIndex } = this.#validateAndConvertCoord(
      this.#lastMoveInHistory
    );

    // removes the current value from the possibleLetters array, and sets value to undefined
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
    // faster then arr[arr.length - 1]
    return this.#history.slice(-1)[0];
  }

  get boardSize(): number {
    return this.#size;
  }
}
