import { add } from "../src/math/add";

test("Add two numbers", () => {
  expect(add(3, 5)).toBe(8);
});
