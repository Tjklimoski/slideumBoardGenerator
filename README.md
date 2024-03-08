# SLIDEUM BOARD GENERATOR

A program written in JS to create a grid of intersecting words of a specified size (between 3 to 5 characters long).

result ex:

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

The resulting board will have the character placements shuffled and used for an online game where you slide the pieces around on the board to rebuild the correct results. Like a mix of wordle meets a rubik cube.

Dictionaries used for the various word lengths were pulled from a valid word list for scrabble.

## How to run

Clone the repo to your local machine, navigate to directory.

```
npm run start
```

**Uncomment lines 45-49 in Generator.ts to see the program step through every decision as it fills the board**

## General approach

Board generator algorithm inspired by a wave function collapse algorithm. The first tile is picked at random and assigned a letter based on a list of valid letters for that tile. After each assignment, all unassigned tiles have their list of valid letters updated based on the partial words they need to complete (in both row and col direction). The tile with the lowest count of possible letters is choosen to have a value assigned next, and the process repeats.

If any tile reaches a count of zero possible letters, then the last assigned letter is reasigned to a new value and the process continues.

View my (messy) personal notes as I worked on the generator [HERE](https://paper-frog-5c5.notion.site/Slideum-V2-3fd92d2160c94738934dcda596eab5cf?pvs=4)

## Performance

When running the 3x3 generator on it's own, it generally took around 13-18ms to generate a board. With the subsantial growth in the size of the board and the word dictionaries, the time for a 5x5 grid averages around 500ms (some as short as 88ms to as long as 1.2s)

3x3 grid has a dictionary of 1067 words.

5x5 grid has a dictionary of 12894 words.
