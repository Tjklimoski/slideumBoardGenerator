import { Generator } from "./Generator";

const generator = new Generator();

generator.getBoard().then(result => console.log("RESULT: ", result));
