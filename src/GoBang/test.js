let Evaluation = require('./evaluation.js').Evaluation


let c = new Array();
for (let i = 0; i <= 15; i++)
	c.push(new Array(15).fill(0))

let a = new Evaluation(c)
a.evaluate(1);
