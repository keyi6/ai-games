const INF = 2147483647;

/* for evaluation */
const ALIVE_ONE   = 10;
const ALIVE_TWO   = 100;
const ALIVE_THREE = 1000;
const ALIVE_FOUR  = 10000;
const ALIVE_FIVE  = 100000;
const DIE_TWO     = 10;
const DIE_THREE   = 100;
const DIE_FOUR    = 1000;


/* for identity representation */
const AI     = 1;
const PLAYER = -1;
const TIE    = 0;


const random_int = (x) => { // get random int [0, x)
	return Math.floor(Math.random() * x);
};

const min = (x, y) => {
	return x < y ? x : y;
}

const max = (x, y) => {
	return x > y ? x : y;
}


const ai_move = (chessboard, depth, alpha, beta) => {									 // predict AI move
	let v = evaluation(board);
	if (depth <= 0 || win_check(chessboard))
		return v;

	let best = -INF;
	let available_points = generagte_available_points(chessboard, depth);

	for (let i = 0; i < available_points.length; i ++) {
		let p = available_points[i];

		chessboard[p[0]][p[1]] = AI; // place
		let cur_score = player_move(chessboard, depth - 1, max(best, beta));
		chessboard[p[0]][p[1]] = 0; // undo

		if (cur_score < best)
			best = cur_score;
		if (cur_score > alpha)
			break;
		}
	}

	return best;
};


const player_move = (chessboard, depth, alpha, beta) => {								 // predict human move
	let v = evaluation(board);
	if (depth <= 0 || win_check(chessboard))
		return v;

	let best = INF;
	let available_points = generagte_available_points(chessboard, depth);

	for (let i = 0; i < available_points.length; i ++) {
		let p = available_points[i];

		chessboard[p[0]][p[1]] = PLAYER; // place
		let cur_score = ai_move(chessboard, depth - 1, min(best, alpha)); // predict player move
		chessboard[p[0]][p[1]] = 0; // undo

		if (cur_score < best)
			best = cur_score;
		if (cur_score < beta)
			break;
		}
	}

	return best;
};


const generagte_available_points = (chessboard, depth) => {

}


const evaluate = (chessboard) => {

}


/*
module.exports.is_full = is_full;
module.exports.is_just_started = is_just_started;
module.exports.win_check= win_check;
module.exports.ai_move = ai_move;
*/

