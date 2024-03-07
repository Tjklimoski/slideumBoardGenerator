import { s3_0 } from "./indexed/s3/position_0";
import { s3_1 } from "./indexed/s3/position_1";
import { s3_2 } from "./indexed/s3/position_2";
import { s4_0 } from "./indexed/s4/position_0";
import { s4_1 } from "./indexed/s4/position_1";
import { s4_2 } from "./indexed/s4/position_2";
import { s4_3 } from "./indexed/s4/position_3";
import { s5_0 } from "./indexed/s5/position_0";
import { s5_1 } from "./indexed/s5/position_1";
import { s5_2 } from "./indexed/s5/position_2";
import { s5_3 } from "./indexed/s5/position_3";
import { s5_4 } from "./indexed/s5/position_4";

export interface IndexedDict {
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

export interface Indexes<T extends number> {
  _0: IndexedDict;
  _1: IndexedDict;
  _2: IndexedDict;
  _3: T extends 4 | 5 ? IndexedDict : undefined;
  _4: T extends 5 ? IndexedDict : undefined;
}

export interface Dictionary {
  s3: Indexes<3>;
  s4: Indexes<4>;
  s5: Indexes<5>;
}

const dictionary: Dictionary = {
  s3: { _0: s3_0, _1: s3_1, _2: s3_2, _3: undefined, _4: undefined },
  s4: { _0: s4_0, _1: s4_1, _2: s4_2, _3: s4_3, _4: undefined },
  s5: { _0: s5_0, _1: s5_1, _2: s5_2, _3: s5_3, _4: s5_4 },
};

export default dictionary;
