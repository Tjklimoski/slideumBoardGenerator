import { all } from "./words.js";
import { _0 } from "./indexed/position_0.js";
import { _1 } from "./indexed/position_1.js";
import { _2 } from "./indexed/position_2.js";

interface indexedDict {
  a: string[];
  b: string[];
  c: string[];
  d: string[];
  e: string[];
  f: string[];
  g: string[];
  h: string[];
  i: string[];
  j: string[];
  k: string[];
  l: string[];
  m: string[];
  n: string[];
  o: string[];
  p: string[];
  q: string[];
  r: string[];
  s: string[];
  t: string[];
  u: string[];
  v: string[];
  w: string[];
  x: string[];
  y: string[];
  z: string[];
}

interface Dictionary {
  all: string[];
  _0: indexedDict;
  _1: indexedDict;
  _2: indexedDict;
}

const dict: Dictionary = {
  all,
  _0,
  _1,
  _2,
};

export default dict;
