import { Board } from "../src/Board";
import { Letter } from "../src/Letter";

describe("Board Class", () => {
  describe("constructor", () => {
    test("initalizes board matrix with Letters", () => {
      const board = new Board();
      const expectedLetter1 = new Letter("00");
      const expectedLetter2 = new Letter("21");
      expect(board.board).toHaveLength(3);
      expect(board.board[0][0]).toEqual(expectedLetter1);
      expect(board.board[2][1]).toEqual(expectedLetter2);
    });
    test("initalizes correctly sized board", () => {
      const board = new Board(4);
      expect(board.board).toHaveLength(4);
    });
  });

  describe("get board", () => {
    test("returns up to date board matrix", () => {
      const board = new Board();
      expect(board.board[0][0].value).toBeUndefined();
      board.board[0][0].assignValue_Random();
      expect(board.board[0][0].value).not.toBeUndefined();
    });
  });

  describe("all words method", () => {
    test("returns all words in board matrix", () => {
      const board = new Board();
      let allWords = board.allWords();
      expect([...allWords.rows, ...allWords.cols].length).toBe(6);
      expect([...allWords.rows, ...allWords.cols][4]).toBe("   ");
      board.board[0][0].assignValue_Random();
      board.board[0][1].assignValue_Random();
      board.board[0][2].assignValue_Random();
      board.board[1][1].assignValue_Random();
      board.board[2][1].assignValue_Random();
      allWords = board.allWords();
      expect([...allWords.rows, ...allWords.cols][4]).not.toBe("   ");
      expect([...allWords.rows, ...allWords.cols][1]).not.toBe("   ");
      expect([...allWords.rows, ...allWords.cols][3]).not.toBe("   ");
    });
  });

  describe("get getCompletedWords", () => {
    test("returns all completed words in board matrix", () => {
      const board = new Board();
      expect(board.getCompletedWords.length).toBe(0);
      board.board[0][0].assignValue_Random();
      expect(board.getCompletedWords.length).toBe(0);
      board.board[0][1].assignValue_Random();
      board.board[0][2].assignValue_Random();
      board.board[1][1].assignValue_Random();
      board.board[2][1].assignValue_Random();
      expect(board.getCompletedWords.length).toBe(2);
      const expectedWord =
        (board.board[0][1].value ?? " ") +
        (board.board[1][1].value ?? " ") +
        (board.board[2][1].value ?? " ");
      expect(board.getCompletedWords).toContain(expectedWord);
    });
  });

  describe("get hasDuplicateWords", () => {
    test("returns false when no duplicate word in matrix", () => {
      const board = new Board();
      expect(board.hasDuplicateWord).toBe(false);
      board.board[0][0].assignValue_Random();
      board.board[0][1].assignValue_Random();
      board.board[0][2].assignValue_Random();
      board.board[1][1].assignValue_Random();
      board.board[2][1].assignValue_Random();
      expect(board.hasDuplicateWord).toBe(false);
    });
    test("returns true when duplicate word in matrix", () => {
      const board = new Board();
      board.board[0][0].assignValue_Ordered();
      board.board[0][1].assignValue_Ordered();
      board.board[0][2].assignValue_Ordered();
      board.board[1][1].assignValue_Ordered();
      board.board[2][1].assignValue_Ordered();
      expect(board.hasDuplicateWord).toBe(true);
    });
  });

  describe("get hasPossibleLettersCountOfZero", () => {
    test("returns false when no letter has a count of 0", () => {
      const board = new Board();
      expect(board.hasPossibleLettersCountOfZero).toBe(false);
      board.board[1][2].possibleLetters = ["c"];
      board.board[0][0].possibleLetters = ["a"];
      expect(board.hasPossibleLettersCountOfZero).toBe(false);
    });
    test("returns true when at least 1 letter has a count of 0", () => {
      const board = new Board();
      board.board[1][2].possibleLetters = [];
      expect(board.hasPossibleLettersCountOfZero).toBe(true);
      board.board[0][0].possibleLetters = [];
      expect(board.hasPossibleLettersCountOfZero).toBe(true);
    });
  });

  describe("getTargetWords method", () => {
    test("returns row word and col word that intersect at target coord", () => {
      const board = new Board();
      expect(board.getTargetWords(board.board[0][0]).colWord).toBe("   ");
      expect(board.getTargetWords(board.board[0][0]).rowWord).toBe("   ");
      board.board[0][1].assignValue_Ordered();
      expect(board.getTargetWords(board.board[0][0]).rowWord).toBe(" a ");
      expect(board.getTargetWords(board.board[0][0]).colWord).toBe("   ");
      expect(board.getTargetWords(board.board[0][1]).colWord).toBe("a  ");
      board.board[0][0].assignValue_Ordered();
      board.board[0][2].assignValue_Ordered();
      expect(board.getTargetWords(board.board[0][0]).rowWord).toBe("aaa");
    });
  });
});
