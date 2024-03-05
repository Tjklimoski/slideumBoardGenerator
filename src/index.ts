import { Generator } from "./Generator.js";

const generator = new Generator();

generator
  .generate()
  .then(result => console.log("RESULT: ", result))
  .catch(err => console.error(err));
