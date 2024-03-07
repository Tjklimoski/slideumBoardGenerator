import { Generator } from "./Generator";

const generator3 = new Generator();
const generator4 = new Generator(4);
const generator5 = new Generator(5);

console.time("gen 3x3");
generator3.getBoard().then(result => {
  console.log("RESULT: ", result);
  console.timeEnd("gen 3x3");
});

console.time("gen 4x4");
generator4.getBoard().then(result => {
  console.log("RESULT: ", result);
  console.timeEnd("gen 4x4");
});

console.time("gen 5x5");
generator5.getBoard().then(result => {
  console.log("RESULT: ", result);
  console.timeEnd("gen 5x5");
});
