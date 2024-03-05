import { Generator } from "./Generator.js";

const generator = new Generator();

generator.getBoard().then(result => console.log("RESULT: ", result));
