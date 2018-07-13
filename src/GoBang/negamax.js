const INF = 268435456;





/* for identity representation */
const AI     = 1;
const PLAYER = -1;
const TIE    = 0;


/* golbal var */
let g_chessboard;  // chessboard, 15 x 15
let g_search_cnt;  // search count
let g_cut_cnt;     // cut count
let g_next_move;   // next move, n x 2


/* configuration */
let max_depth = 3;

const _init_chessboard = () => { // {{{
	this.chessboard = new Array();
	for (let i = 0; i < 15; i ++)
		this.chessboard.push(new Array(15).fill(0));
}; // }}}


const set_max_depth = (_depth) => { // {{{
	DEPTH = _depth;
}; // }}}


const start_game = (first_hand) => { // {{{
	_init_g_chessboard();
}; // }}}


const _random_int = (x) => { // get random int [0, x) // {{{
	return Math.floor(Math.random() * x);
}; // }}}


const win_check = () => {
};


const ai_move = (chessboard) => { //{{{
	g_chessboard = chessboard;

	g_search_cnt = g_cut_cnt = 0; // init counters

	let score = negamax(AI, DEPTH, -INF, INF);


}; // }}}


const _generagte_available_points = () => {
};



const _negamax = (role, depth, alpha, beta) => { // {{{
	let e = new Evaluation(g_chessboard);
	if (depth <= 0 || win_check())
		return e.evaluation(role);

	search_list = _generagte_available_points();
	for (i in search_list) {
		g_search_cnt ++;
		let x = search_list[i][0], y = search_list[i][1];

		g_chessboard[x][y] = role; // place
		let val = -negamax(-role, depth - 1, -beta, -alpha);
		g_chessboard[x][y] = 0; // undo

		if (val > alpha) {
			if (depth == max_depth)
				g_next_move.push([x, y]);
			if (val >= beta) {
				g_cut_cnt ++;
				return beta;
			}

			alpha = val;
		}
	}

	return alpha;
}; // }}}


/*
module.exports.is_full = is_full;
module.exports.win_check= win_check;
*/

module.exports.ai_move = ai_move;
module.exports.set_max_depth = set_max_depth;
module.exports.start_game = start_game;
