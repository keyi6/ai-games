let Evaluation = require('./evaluation.js').Evaluation


let c = new Array();
for (let i = 0; i < 15; i++)
	c.push(new Array(15).fill(0))
c[7][7] = c[6][6] = c[7][6] = 1;
console.log(c);
console.log('');

let a = new Evaluation(c)
a.evaluate(1);

console.log(a.point_type[1])
