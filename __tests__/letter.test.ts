import { Letter } from "../src/Letter";

describe("Letter class", () => {
  // creeate spy for console.warn to prevent logging to actual console, and to capture msg
  let consoleWarnSpy: jest.SpyInstance<void, any>;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe("constructor", () => {
    test("throws error for invalid coord", () => {
      expect(() => new Letter("A1")).toThrow(
        "coord must be 2 numerical digits long"
      );
    });

    test("initializes Letter with coord", () => {
      const letter = new Letter("12");
      expect(letter.coord).toBe("12");
      expect(letter.rowIndex).toBe(1);
      expect(letter.colIndex).toBe(2);
    });

    test("initializes full alphabet possibleLetters array", () => {
      const letter = new Letter("12");
      expect(letter.possibleLetters).toEqual(
        "abcdefghijklmnopqrstuvwxyz".split("")
      );
      expect(letter.possibleLettersCount).toBe(26);
    });
  });

  describe("revert method", () => {
    test("removes value from possibleLetters", () => {
      const letter = new Letter("12");
      letter.value = "a";
      letter.revert();
      expect(letter.value).toBeUndefined();
      expect(letter.possibleLetters).not.toContain("a");
    });
  });

  describe("assignValue_Random method", () => {
    test("assigns a random value to Letter", () => {
      const letter = new Letter("12");
      letter.assignValue_Random();
      expect(letter.value).toBeDefined();
      expect(letter.possibleLetters).toContain(letter.value);
    });
  });

  describe("assignValue_Ordered method", () => {
    test("assigns the first possible value in possibleLetters to Letter", () => {
      const letter = new Letter("12");
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
      const letter = new Letter("12");
      expect(letter.value).toBeUndefined();
    });

    test("sets and gets value", () => {
      const letter = new Letter("12");
      letter.value = "a";
      expect(letter.value).toBe("a");
    });

    test("throws error for invalid value", () => {
      const letter = new Letter("12");
      expect(() => (letter.value = "12")).toThrow("Invalid value passed");
      expect(() => (letter.value = "AB")).toThrow("Invalid value passed");
    });
  });

  describe("possibleLetters property", () => {
    test("sets and gets possibleLetters properly", () => {
      const letter = new Letter("12");
      letter.possibleLetters = ["A", "B", "C"];
      expect(letter.possibleLetters).toEqual(["A", "B", "C"]);
    });

    test("throws error for invalid array", () => {
      const letter = new Letter("12");
      expect(() => (letter.possibleLetters = ["A", "B", "B"])).toThrow(
        "Invalid array passed"
      );
      expect(() => (letter.possibleLetters = ["A", "B", "1"])).toThrow(
        "Invalid array passed"
      );
    });

    test("does not update possibleLetters if value is already set", () => {
      const letter = new Letter("12");
      letter.value = "A";
      letter.possibleLetters = ["B", "C"];
      expect(console.warn).toHaveBeenCalledWith(
        'Letter value already set to "A". Updating possibleLetters array blocked'
      );
    });
  });

  describe("possibleLettersCount property", () => {
    test("Count changes based on possibleLetters", () => {
      const letter = new Letter("12");
      expect(letter.possibleLettersCount).toBe(26);
      const newPossibleLetters = ["a", "b", "c"];
      letter.possibleLetters = newPossibleLetters;
      expect(letter.possibleLettersCount).toBe(newPossibleLetters.length);
    });
  });

  describe("coord, rowIndex, colIndex", () => {
    test("Can not overwrite coord", () => {
      const letter = new Letter("12");
      letter.coord = "00";
      expect(console.warn).toHaveBeenCalledWith(
        "Can not set coord after initilizataion. Delete this object and initalize a new Letter"
      );
    });

    test("Can not overwrite rowIndex", () => {
      const letter = new Letter("12");
      letter.rowIndex = 0;
      expect(console.warn).toHaveBeenCalledWith(
        "Can not set rowIndex after initilizataion. Delete this object and initalize a new Letter"
      );
    });

    test("Can not overwrite colIndex", () => {
      const letter = new Letter("12");
      letter.colIndex = 0;
      expect(console.warn).toHaveBeenCalledWith(
        "Can not set colIndex after initilizataion. Delete this object and initalize a new Letter"
      );
    });
  });
});
