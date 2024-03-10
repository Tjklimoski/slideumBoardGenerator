function indexWords(words, i) {
  const obj = {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
    h: [],
    i: [],
    j: [],
    k: [],
    l: [],
    m: [],
    n: [],
    o: [],
    p: [],
    q: [],
    r: [],
    s: [],
    t: [],
    u: [],
    v: [],
    w: [],
    x: [],
    y: [],
    z: [],
  };

  return words.reduce((obj, word) => {
    if (i >= word.length || i < 0) throw new Error("Invalid index");
    const letterAtIndex = word[i];
    obj[letterAtIndex].push(word);
    return obj;
  }, obj);
}
