let a = [1, 2, 3, 4];
let b = a.findIndex(x => x == 5);
b == -1 || a.splice(-1, 1);
console.log(a);