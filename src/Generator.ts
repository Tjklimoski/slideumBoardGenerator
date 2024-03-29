import type { Letter } from "./Letter";
import { Board } from "./Board";
import dictionary from "./dict/dict";
import type { Dictionary, IndexedDict, Indexes } from "./dict/dict";

export type ResultMatrix = string[][];

export class Generator {
  #size: 3 | 4 | 5;
  #history: Letter[];
  #board: Board;

  constructor(size: 3 | 4 | 5 = 3) {
    if (size < 3 || size > 5)
      throw new Error("Invalid size - must be a number between 3 and 5.");
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
    if (this.#lastMoveInHistory && !this.#lastMoveInHistory.value)
      return this.#lastMoveInHistory;

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
    if (this.#history.includes(letter)) return;
    this.#history.push(letter);
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
    const letters = this.#board.board.flat();

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      if (letter.value !== undefined) continue;

      const { rowWord, colWord } = this.#board.getTargetWords(letter);

      // rowWord needs the letters in the COL index position
      // colWord needs the letters in the ROW index position
      const rowLetterFinder = this.#letterFinder(rowWord, letter.colIndex);
      const colLetterFinder = this.#letterFinder(colWord, letter.rowIndex);

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

      if (word[index] !== " " || word.length !== this.#size)
        rej(new Error("Incorrect index or word passed"));

      const firstLetterIndex = word.search(/\w/i);
      // firstLetterIndex set to -1 when no letters in word. ex: "   "
      // add full alphabet to set and resolve promise:
      if (firstLetterIndex === -1) {
        "abcdefghijklmnopqrstuvwxyz"
          .split("")
          .forEach(letter => set.add(letter));
        res(set);
      }

      const sizeKey = `s${this.#size}` as keyof Dictionary;
      const positionKey = `_${firstLetterIndex}` as keyof Indexes<number>;
      const letterKey = word[
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
      dictionary[sizeKey]?.[positionKey]?.[letterKey].forEach(word => {
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
    if (this.#lastMoveInHistory?.possibleLettersCount === 0) {
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
    // removes the current value from the possibleLetters array, and sets value to undefined
    this.#lastMoveInHistory?.revert();
  }

  get #lastMoveInHistory(): Letter | undefined {
    // faster then arr[arr.length - 1]
    return this.#history.slice(-1)[0];
  }

  get boardSize(): 3 | 4 | 5 {
    return this.#size;
  }
}
