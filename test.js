const a = {};
const b = { x: 1, y: 2 };

const { x, y } = a || b;
console.log(x + y);