# SLIDEUM BOARD GENERATOR

A program written in TS to create a grid of intersecting words of a specified size (between 3 to 5 characters long).

results example:

```
[
  [ 'r', 'o', 'o' ],
  [ 'y', 'i', 'p' ],
  [ 'a', 'l', 's' ]
]

[
  [ 'p', 'a', 'l', 'm' ],
  [ 's', 'w', 'i', 'z' ],
  [ 's', 'n', 'e', 'e' ],
  [ 't', 'y', 'r', 'e' ]
]
```

**All words on the generated board are unique (can't have the same word appear twice on the baord).**

The resulting board will be used for Slideum game, where the letter placements will be shuffled and the player will slide the pieces around on the board to rebuild the correct results. Like wordle meets a rubik cube.

Dictionaries used for the various word lengths were pulled from a Scrabble word list.

## How to run

Clone the repo to your local machine, navigate to directory, install dependencies.

```
npm run start
```

Output runs in the console.

**Uncomment lines 39-43 in Generator.ts to see the program step through every decision as it fills the board**

**Adjust line 4 on index.ts to change which sized board you want generated.**

## General approach

Board generator algorithm inspired by a wave function collapse algorithm. The first tile is picked at random and assigned a value based on a list of valid letters for that tile. After each assignment, all unassigned tiles have their list of valid letters updated based on the partial words they need to complete (in both row and col direction). The tile with the lowest count of possible letters is choosen to have a value assigned next, and the process repeats.

If any tile reaches a count of zero possible letters, then the last assigned letter is reverted and reassigned to a new value, then the process continues.

View my (messy) personal notes as I worked on the generator [HERE](https://paper-frog-5c5.notion.site/Slideum-V2-3fd92d2160c94738934dcda596eab5cf?pvs=4)

## Performance

When running the 3x3 generator on it's own, it generally took around 13-18ms to generate a board. With the subsantial growth in the size of the board and the word dictionaries, the time for a 5x5 grid averages around 500ms (some as short as 88ms to as long as 1.2s)

3x3 grid has a dictionary of 1067 words.

5x5 grid has a dictionary of 12894 words.
