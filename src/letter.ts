class Letter {
  // private variables to prevent being overwritten after initilizataion with bad values
  #value: string | undefined;
  #possibleLetters: string[];
  #coord: string;
  #rowIndex: number;
  #colIndex: number;

  constructor(coord: string) {
    if (coord.length !== 2 || isNaN(parseInt(coord)))
      throw new Error("coord must be 2 numerical digits long");

    this.#value = undefined;
    this.#possibleLetters = "abcdefghijklmnopqrstuvwxyz".split("");
    this.#coord = coord;
    // use rowIndex when need to know index position of Letter when doing COL word
    this.#rowIndex = parseInt(coord[0]);
    // use colIndex when need to know index position of Letter when doing ROW word
    this.#colIndex = parseInt(coord[1]);
  }

  // reset Letter value to undefined, remove Letter value from possibleLetters array.
  revert(): void {
    this.#possibleLetters = this.#possibleLetters.filter(
      letter => letter !== this.#value
    );
    this.#value = undefined;
  }

  get value(): string | undefined {
    return this.#value;
  }

  set value(letter: string) {
    const notLetter = letter.length !== 1;
    const isNumber = /\d/.test(letter);

    if (notLetter || isNumber) {
      throw new Error("Invalid value passed, must pass a single letter");
    } else {
      this.#value = letter;
    }
  }

  get possibleLetters(): string[] {
    return this.#possibleLetters;
  }

  set possibleLetters(arr: string[]) {
    // validate
    const hasDuplicates = new Set(arr).size !== arr.length;
    const hasWords = arr.some(letter => letter.length !== 1);
    const hasNumbers = /\d/.test(arr.join(""));

    if (hasDuplicates || hasWords || hasNumbers) {
      throw new Error("Invlaid array passed");
    } else if (this.#value !== undefined) {
      console.warn(
        `Letter value already set to "${
          this.#value
        }". Updating possibleLetters array blocked`
      );
    } else {
      this.#possibleLetters = arr;
    }
  }

  get possibleLettersCount() {
    return this.#possibleLetters.length;
  }

  get coord(): string {
    return this.#coord;
  }

  set coord(_) {
    console.warn(
      "Can not set coord after initilizataion. Delete this object and initalize a new Letter"
    );
  }

  get rowIndex(): number {
    return this.#rowIndex;
  }

  set rowIndex(_) {
    console.warn(
      "Can not set rowIndex after initilizataion. Delete this object and initalize a new Letter"
    );
  }

  get colIndex(): number {
    return this.#colIndex;
  }

  set colIndex(_) {
    console.warn(
      "Can not set colIndex after initilizataion. Delete this object and initalize a new Letter"
    );
  }
}
