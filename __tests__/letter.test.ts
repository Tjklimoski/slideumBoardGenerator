import { Letter } from "../src/Letter";

describe("Letter class", () => {
  // creeate spy for console.warn to prevent logging to actual console, and to capture msg
  let consoleWarnSpy: jest.SpyInstance<void, any>;
  let letter: Letter;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    // create a new letter object for each test
    letter = new Letter("12");
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe("constructor", () => {
    test("throws error for invalid coord", () => {
      expect(() => new Letter("A1")).toThrow(
        "coord must be 2 numerical digits long"
      );
      expect(() => new Letter("33")).toThrow(
        "coordinate values [3, 3] can not be equal to or greater than board size 3"
      );
    });

    test("initializes Letter with coord", () => {
      expect(letter.coord).toBe("12");
      expect(letter.rowIndex).toBe(1);
      expect(letter.colIndex).toBe(2);
    });

    test("initializes full alphabet in possibleLetters array", () => {
      expect(letter.possibleLetters).toEqual(
        "abcdefghijklmnopqrstuvwxyz".split("")
      );
      expect(letter.possibleLettersCount).toBe(26);
    });
  });

  describe("revert method", () => {
    test("removes value from possibleLetters", () => {
      letter.value = "a";
      letter.revert();
      expect(letter.value).toBeUndefined();
      expect(letter.possibleLetters).not.toContain("a");
    });
  });

  describe("assignValue_Random method", () => {
    test("assigns a random value to Letter", () => {
      letter.assignValue_Random();
      expect(letter.value).toBeDefined();
      expect(letter.possibleLetters).toContain(letter.value);
    });
  });

  describe("assignValue_Ordered method", () => {
    test("assigns the first possible value in possibleLetters to Letter", () => {
      letter.assignValue_Ordered();
      expect(letter.value).toBe("a");
      letter.revert();
      letter.possibleLetters = "kdeaz".split("");
      letter.assignValue_Ordered();
      expect(letter.value).toBe("k");
    });
  });

  describe("value property", () => {
    test("value starts as undefined", () => {
      expect(letter.value).toBeUndefined();
    });

    test("sets and gets value", () => {
      letter.value = "a";
      expect(letter.value).toBe("a");
    });

    test("throws error for invalid value", () => {
      expect(() => (letter.value = "12")).toThrow("Invalid value passed");
      expect(() => (letter.value = "AB")).toThrow("Invalid value passed");
    });
  });

  describe("possibleLetters property", () => {
    test("sets and gets possibleLetters properly", () => {
      letter.possibleLetters = ["A", "B", "C"];
      expect(letter.possibleLetters).toEqual(["A", "B", "C"]);
    });

    test("throws error for invalid array", () => {
      expect(() => (letter.possibleLetters = ["A", "B", "B"])).toThrow(
        "Invalid array passed"
      );
      expect(() => (letter.possibleLetters = ["A", "B", "1"])).toThrow(
        "Invalid array passed"
      );
    });

    test("does not update possibleLetters if value is already set", () => {
      letter.value = "A";
      letter.possibleLetters = ["B", "C"];
      expect(console.warn).toHaveBeenCalledWith(
        'Letter value already set to "A". Updating possibleLetters array blocked'
      );
    });
  });

  describe("possibleLettersCount property", () => {
    test("Count changes based on possibleLetters", () => {
      expect(letter.possibleLettersCount).toBe(26);
      const newPossibleLetters = ["a", "b", "c"];
      letter.possibleLetters = newPossibleLetters;
      expect(letter.possibleLettersCount).toBe(newPossibleLetters.length);
    });
  });

  describe("coord, rowIndex, colIndex", () => {
    test("Can not overwrite coord", () => {
      letter.coord = "00";
      expect(console.warn).toHaveBeenCalledWith(
        "Can not set coord after initilizataion. Delete this object and initalize a new Letter"
      );
    });

    test("Can not overwrite rowIndex", () => {
      letter.rowIndex = 0;
      expect(console.warn).toHaveBeenCalledWith(
        "Can not set rowIndex after initilizataion. Delete this object and initalize a new Letter"
      );
    });

    test("Can not overwrite colIndex", () => {
      letter.colIndex = 0;
      expect(console.warn).toHaveBeenCalledWith(
        "Can not set colIndex after initilizataion. Delete this object and initalize a new Letter"
      );
    });
  });
});
