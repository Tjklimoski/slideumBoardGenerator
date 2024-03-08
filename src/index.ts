import { Generator } from "./Generator";

// Only valid sizes for Generator are 3, 4, & 5
const size = 3;

const generator = new Generator(size);

console.time(`gen ${size}x${size}`);
generator.getBoard().then(result => {
  console.log("RESULT: ", result);
  console.timeEnd(`gen ${size}x${size}`);
});
