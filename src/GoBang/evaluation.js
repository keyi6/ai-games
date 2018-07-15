/*
 * point_type: point type in every direction, 2 x 4 x 15 x 15
 $ cnt: count of each type, 2 x 12
*/


/* for type */
const NONE_TYPE   = 0;
const DIE_TWO	  = 1;
const DIE_THREE   = 2;
const DIE_FOUR	  = 3;
const ALIVE_ONE   = 4;
const ALIVE_TWO   = 5;
const ALIVE_THREE = 6;
const ALIVE_FOUR  = 7;
const ALIVE_FIVE  = 8;
const DB_THREE	  = 9;
const THREE_FOUR  = 10
const DB_FOUR	  = 11;

const INF = 1000000;
const SCORE = [0, 1, 10, 100, 1000, 10, 100, 1000, 10000, INF];


/* for direction */
const HORIZON		 = 0;
const VERTICAL		 = 1;
const LEFT_DIAGONAL  = 2;
const RIGHT_DIAGONAL = 3;


/* for identity representation */
const AI	 = 1;
const PLAYER = -1;
const TIE	 = 0;


/* for neighbors */
const DX = [0,	-1, -1, -1, 0, 1,  1, 1];
const DY = [-1, -1,  1,  0, 1, 1, -1, 0];


const abs = (x) => {
	return x > 0 ? x : -x;
};


/* match type */
const _match_type = (arr, len, pos, role, record) => {
	if (arr[pos] !== role)
		return record;

	if ((pos === 0 || (pos >= 1 && arr[pos - 1] === -role)) && pos + 4 < len) { // left blocked
		if (arr[pos + 1] === role &&
			arr[pos + 2] === role &&
			arr[pos + 3] === role &&
			arr[pos + 4] === role) {
			for (let i = 0; i <= 4; i ++)
				record[pos + i] = ALIVE_FIVE;
		}
		else if (arr[pos + 1] === role &&
				arr[pos + 2] === role &&
				arr[pos + 3] === role &&
				arr[pos + 4] === 0) {
			for (let i = 0; i <= 3; i ++)
				record[pos + i] = DIE_FOUR;
		}
		else if (arr[pos + 1] === role &&
				arr[pos + 2] === role &&
				arr[pos + 3] === 0) {
			if (arr[pos + 4] === role) {
				for (let i = 0; i <= 2; i ++)
					record[pos + i] = DIE_FOUR;
				record[pos + 4] = DIE_FOUR;
			}
			else if (arr[pos + 4] === 0) {
				for (let i = 0; i <= 2; i ++)
					record[pos + i] = DIE_THREE;
			}
		}
		else if (arr[pos + 1] === role &&
				arr[pos + 2] === 0 &&
				arr[pos + 4] === 0) {
			if (arr[pos + 3] === 0)
				record[pos] = record[pos + 1] = DIE_TWO;
			else if (arr[pos + 3] === role)
				record[pos] = record[pos + 1] = record[pos + 3] = DIE_THREE;
		}
		else if (arr[pos + 1] === 0 &&
				arr[pos + 2] === role &&
				arr[pos + 3] === role) {
			if (arr[pos + 4] === role)
				record[pos] = record[pos + 2] = record[pos + 3] = record[pos + 4] = DIE_FOUR;
			else
				record[pos] = record[pos + 2] = record[pos + 3] = DIE_FOUR;
		}
	}
	else {
		let l = 0, r = 0;
		while (0 <= pos - l && arr[pos - l] === 0)
			l ++;
		while (pos + r < len && arr[pos + r] !== -role)
			r ++;

		if (l + r < 4)
			return record;

		if (r >= 4 &&
			arr[pos + 1] === role &&
			arr[pos + 2] === role &&
			arr[pos + 3] === role &&
			arr[pos + 4] === role) {
			for (let i = 0; i <= 4; i ++)
				record[pos + i] = ALIVE_FIVE;
		}
		else if (r >= 3 &&
			arr[pos + 1] === role &&
			arr[pos + 2] === role &&
			arr[pos + 3] === role &&
			(l >= 1 || r >= 4)) {
			for (let i = 0; i <= 3; i ++)
				record[pos + i] = ALIVE_FOUR;
		}
		else if (r >= 2 &&
			arr[pos + 1] === role &&
			arr[pos + 2] === role) {
			if (r >= 4 && arr[pos + 4] === role && arr[pos + 3] === 0)
				record[pos] = record[pos + 1] = record[pos + 2] = record[pos + 4] = ALIVE_FOUR;
			else
				record[pos] = record[pos + 1] = record[pos + 2] = ALIVE_THREE;
		}
		else if (r >= 1 &&
				arr[pos + 1] === role) {
			if (r >= 3 && r[pos + 2] === 0 && r[pos + 3] === role)
				record[pos] = record[pos + 1] = record[pos + 3] = ALIVE_THREE;
			else
				record[pos] = record[pos + 1] = ALIVE_TWO;
		}
		else {
			if (r >= 4 &&
				arr[pos + 1] === 0 &&
				arr[pos + 2] === role &&
				arr[pos + 3] === role &&
				arr[pos + 4] === role)
					record[pos] = record[pos + 2] = record[pos + 3] = record[pos + 4] = ALIVE_FOUR;
			else if (r >= 3 &&
				arr[pos + 1] === 0 &&
				arr[pos + 2] === role &&
				arr[pos + 3] === role)
					record[pos] = record[pos + 2] = record[pos + 3] = ALIVE_THREE;
		}
	}

	return record;
};


const _is_better_than = (t1, t2) => {
	return SCORE[t1] > SCORE[t2];
}


/* check line */
const _line_check = (arr, len) => {
	let record_ai = new Array(len).fill(0);
	let record_player = new Array(len).fill(0);
	let _record;

	for (let i = 0; i < len; i ++) {
		if (arr[i] == AI) {
			_record = _match_type(arr, len, i, AI, record_ai.slice());
			if (_is_better_than(_record[i], record_ai[i]))
				record_ai = _record.slice();
		}

		if (arr[i] == PLAYER) {
			_record = _match_type(arr, len, i, PLAYER, record_player.slice());
			if (_is_better_than(_record[i], record_player[i]))
				record_player = _record.slice();
		}
	}

	return [record_player, record_ai];
};


/* evaluation class*/
class Evaluation {
	constructor(_chessboard) {
		this.chessboard = _chessboard;

		this.cnt = [];
		for (let i = 0; i < 2; i ++)
			this.cnt.push(new Array(12).fill(0));

		this.point_type = [];
		for (let i = 0; i < 2; i ++) {
			let x = [];

			for (let j = 0; j < 4; j ++) {
				let y = [];

				for (let k = 0; k < 15; k ++)
					y.push(new Array(15).fill(0))

				x.push(y);
			}

			this.point_type.push(x);
		}
	}


	_init_cnt() {
		this.cnt = [];
		for (let i = 0; i < 2; i ++)
			this.cnt.push(new Array(12).fill(0));
	}


	_init_point_type() {
		this.point_type = [];
		for (let i = 0; i < 2; i ++) {
			let x = [];

			for (let j = 0; j < 4; j ++) {
				let y = [];

				for (let k = 0; k < 15; k ++)
					y.push(new Array(15).fill(0))

				x.push(y);
			}

			this.point_type.push(x);
		}
	}


	/* check horizental */
	_horizontal_check() {
		let _record;
		for (let i = 0; i < 15; i ++) {
			_record = _line_check(this.chessboard[i], 15);

			this.point_type[0][HORIZON][i] = _record[0];
			this.point_type[1][HORIZON][i] = _record[1];
		}
	}


	/* check vertical*/
	_vertical_check() {
		let arr, _record;
		for (let i = 0; i < 15; i ++) {
			arr = [];
			for (let j = 0; j < 15; j ++)
				arr.push(this.chessboard[j][i]);

			_record = _line_check(arr, 15);

			for (let j = 0; j < 15; j ++) {
				this.point_type[0][VERTICAL][j][i] = _record[0][j];
				this.point_type[1][VERTICAL][j][i] = _record[1][j];
			}
		}
	}


	/* check right diagnoal */
	_right_diagonal_check() {
		let dx = 1, dy = 1, x, y ,arr, _record;
		for (let i = 0; i <= 10; i ++) {
			/* lower part */
			arr = [];
			x = i; y = 0;
			for (let j = 0; j < 15 - i; j ++) {
				arr.push(this.chessboard[x][y]);
				x += dx; y += dy;
			}

			_record = _line_check(arr, 15 - i);

			x = i; y = 0;
			for (let j = 0; j < 15 - i; j ++) {
				this.point_type[0][RIGHT_DIAGONAL][x][y] = _record[0][j];
				this.point_type[1][RIGHT_DIAGONAL][x][y] = _record[1][j];
				x += dx; y += dy;
			}

			if (i === 0)
				continue;

			/* upper part */
			x = 0, y = i;
			arr = [];
			for (let j = 0; j < 15 - i; j ++) {
				arr.push(this.chessboard[x][y]);
				x += dx; y += dy;
			}

			_record = _line_check(arr, 15 - i);

			x = 0; y = i;
			for (let j = 0; j < 15 - i; j ++) {
				this.point_type[0][RIGHT_DIAGONAL][x][y] = _record[0][j];
				this.point_type[1][RIGHT_DIAGONAL][x][y] = _record[1][j];
				x += dx; y += dy;
			}
		}
	}


	/* check left diagnoal */
	_left_diagonal_check() {
		let dx = 1, dy = -1, x, y, arr, _record;
		for (let i = 1; i < 15; i ++) {
			if (i >= 4) {
				/* upper part */
				arr = [];
				x = 0; y = i;
				for (let j = 0; j <= i; j ++) {
					arr.push(this.chessboard[x][y]);
					x += dx; y += dy;
				}

				_record = _line_check(arr, i + 1);

				x = 0; y = i;
				for (let j = 0; j <= i; j ++) {
					this.point_type[0][LEFT_DIAGONAL][x][y] = _record[0][j];
					this.point_type[1][LEFT_DIAGONAL][x][y] = _record[1][j];
					x += dx; y += dy;
				}

			}

			if (i <= 10) {
				/* lower part */
				x = i, y = 14;
				arr = [];
				for (let j = 0; j < 15 - i; j ++) {
					arr.push(this.chessboard[x][y]);
					x += dx; y += dy;
				}

				_record = _line_check(arr, 15 - i);

				x = i; y = 14;
				for (let j = 0; j < 15 - i; j ++) {
					this.point_type[0][LEFT_DIAGONAL][x][y] = _record[0][j];
					this.point_type[1][LEFT_DIAGONAL][x][y] = _record[1][j];
					x += dx; y += dy;
				}
			}
		}
	}


	/* chessboard evaluation */
	evaluate_chessboard(role) {
		/* init variants */
		this._init_point_type();
		this._init_cnt();


		/* check four directions */
		this._horizontal_check();
		this._vertical_check();
		this._left_diagonal_check();
		this._right_diagonal_check();

		/* update cnt */
		let _, _score;
		for (let who = 0; who < 2; who ++)
			for (let i = 0; i < 15; i ++)
				for (let j = 0; j < 15; j ++) {
					_score = 0;
					for (let dir = 0; dir < 4; dir ++) {
						_ = this.point_type[who][dir][i][j];

						if (_ === NONE_TYPE)
							continue;
						this.cnt[who][_] ++;
					}
				}

		/* evaluate this chessboard */
		let my_score = 0, opp_score = 0;
		if (role === AI) {
			if (this.cnt[0][ALIVE_FIVE] > 0)
				return -INF;
			else if (this.cnt[1][ALIVE_FIVE] > 0)
				return INF;

			for (let i = 1; i <= 7; i ++) {
				if (this.cnt[0][i] > 0)
					opp_score += SCORE[i] * (this.cnt[0][i] / 10 + 1)
				if (this.cnt[1][i] > 0)
					my_score += SCORE[i] * (this.cnt[0][i] / 10 + 1)
			}
		}
		else {
			if (this.cnt[0][ALIVE_FIVE] > 0)
				return INF;
			else if (this.cnt[1][ALIVE_FIVE] > 0)
				return -INF;

			for (let i = 1; i <= 7; i ++) {
				if (this.cnt[0][i] > 0)
					my_score += SCORE[i] * (this.cnt[0][i] / 10 + 1)
				if (this.cnt[1][i] > 0)
					opp_score += SCORE[i] * (this.cnt[0][i] / 10 + 1)
			}
		}

		return Math.round(my_score - opp_score / 2);
	}


	/* point evaluation */
	_evaluate_point(x, y, role) {
		let score = 14 - abs(7 - x) - abs(7 - y);
		let t = this.chessboard;

		let nx, ny;
		for (let i = 0; i < 8; i ++) {
			nx = x + DX[i];
			ny = y + DY[i];

			if (0 <= nx && nx < 15 && 0 <= ny && ny < 15 && t[nx][ny] !== 0)
				score += 10;
		}

		let l, r, arr = [];
		for (let i = 0; i < 4; i++) {
			l = r = 0;
			arr = [];
			nx = x;
			ny = y;
			while (0 <= nx && nx < 15 && 0 <= ny && ny < 15) {
				arr.push(t[nx][ny]);
				l++;
				nx += DX[i];
				ny += DY[i];
			}
			arr.reverse();
			arr.pop();

			nx = x;
			ny = y;
			while (0 <= nx && nx < 15 && 0 <= ny && ny < 15) {
				arr.push(t[nx][ny]);
				r++;
				nx += DX[i + 4];
				ny += DY[i + 4];
			}

			let _record_1 = _line_check(arr, l + r - 1);
			arr[l - 1]= role;
			let _record_2 = _line_check(arr, l + r - 1);

			if (role === AI && SCORE[_record_1[1][l - 1]] < SCORE[1][l - 1])
				score += SCORE[_record_2[1][l - 1]];
			else if (role === PLAYER && SCORE[_record_1[0][l - 1]] < SCORE[0][l - 1])
				score += SCORE[_record_2[0][l - 1]];
		}

		return score;
	}


	generate_available_points(role) {
		let point_score = [];
		let t = this.chessboard;

		/* evaluate points */
		for (let i = 0; i < 15; i ++)
			for (let j = 0; j < 15; j ++)
				if (t[i][j] === 0)
					point_score.push({
						score: this._evaluate_point(i, j, role),
						point: [i, j]
					});

		point_score.sort((a, b) => {
			return a.score < b.score ? 1 : -1;
		});

		return point_score;
	}
}



module.exports.Evaluation = Evaluation;
