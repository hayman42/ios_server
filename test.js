const a = { d: 2, c: 3, x: 4 };
const b = { d: 2, c: 3 };
const x = { a, ...b };
const { a: aa, ...z } = x;
console.log(z);