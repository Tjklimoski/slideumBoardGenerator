import { Generator } from "./Generator.js";

const generator = new Generator();

try {
  const result = await generator.generate();
  console.log("RESULT: ", result);
} catch (err) {
  console.error(err);
}
