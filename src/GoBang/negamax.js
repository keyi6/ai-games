let E = require('./evaluation.js');
let Evaluation = E.Evaluation;


const INF = 2684354564;
const ALIVE_FIVE  = 8;

/* for identity representation */
const AI     = 1;
const PLAYER = -1;
const TIE    = 0;

/* for point evaluation */
const POINT_SCORE = [0, 10, 100, 1000, 10, 100, 1000, 1000, 10000];


/* global var */
let g_cut_cnt;     // cut count
let g_search_cnt;  // search count
let g_chessboard;  // chessboard, 15 x 15
let g_next_move;   // next move, n x 2


/* configuration */
let max_depth = 3;


const _init_g_chessboard = () => {
	g_chessboard = [];
	for (let i = 0; i < 15; i ++)
		g_chessboard.push(new Array(15).fill(0));
};


const set_max_depth = (_depth) => {
	max_depth = _depth;
};


const start_game = (first_hand) => {
	_init_g_chessboard();
};


const _random_int = (x) => { // get random int [0, x)
	return Math.floor(Math.random() * x);
};


const win_check = (chessboard) => {
	let e = new Evaluation(chessboard);
	console.log(e.chessboard)
	e.evaluate_chessboard(AI);

	if (e.cnt[0][ALIVE_FIVE] > 0)
		return PLAYER;
	else if (e.cnt[1][ALIVE_FIVE] > 0)
		return AI;

	return 0;
};


const _negamax = (role, depth, alpha, beta) => {
	let e = new Evaluation(g_chessboard);
	if (depth <= 0 || win_check(g_chessboard) !== 0)
		return e.evaluate_chessboard(role);

	let search_list = e.generate_available_points(role);
	for (let i in search_list) {
		g_search_cnt ++;
		let x = search_list[i].point[0];
		let y = search_list[i].point[1];

		g_chessboard[x][y] = role; // place
		let val = -_negamax(-role, depth - 1, -beta, -alpha);
		g_chessboard[x][y] = 0; // undo

		if (val > alpha) {
			if (depth === max_depth)
				g_next_move.push([x, y]);
			if (val >= beta) {
				g_cut_cnt ++;
				return beta;
			}

			alpha = val;
		}
	}

	return alpha;
};


const ai_move = (chessboard) => {
    g_chessboard = chessboard;
    g_next_move = [];
    g_search_cnt = g_cut_cnt = 0; // init counters

    let score = _negamax(AI, max_depth, -INF, INF);

    return [g_next_move.pop(), g_search_cnt, g_cut_cnt, score];
};


module.exports.ai_move = ai_move;
module.exports.win_check = win_check;
module.exports.set_max_depth = set_max_depth;
module.exports.start_game = start_game;
