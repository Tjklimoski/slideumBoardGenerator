import { Board } from "../src/Board";
import { Generator } from "../src/Generator";
import { Letter } from "../src/Letter";

describe("Generator Class", () => {
  describe("constructor", () => {
    test("Creates new generator", () => {
      const gen = new Generator();
      expect(gen).not.toBeNull();
      expect(gen.boardSize).toBe(3);
    });

    test("Creates new generator with specified sized board", () => {
      expect(new Generator(4).boardSize).toBe(4);
      expect(new Generator(5).boardSize).toBe(5);
    });
  });

  describe("getBoard method", () => {
    const gen = new Generator();
    expect(gen.getBoard()).resolves.toBeInstanceOf(Array);
  });

  describe("generate method", () => {
    const gen = new Generator();
    expect(gen.generate()).resolves.toBeInstanceOf(Array);
  });
});
