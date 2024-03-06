import { Generator } from "./Generator";

const generator = new Generator();

console.time("gen");
generator.getBoard().then(result => {
  console.log("RESULT: ", result);
  console.timeEnd("gen");
});
