/*
 * point_score: point score, 15 x 15
 * point_type: point type in every direction, 2 x 4 x 15 x 15
 $ cnt: count of each type, 2 x 12
*/


/* for type */
const NONE_TYPE   = 0;
const DIE_TWO     = 1;
const DIE_THREE   = 2;
const DIE_FOUR    = 3;
const ALIVE_ONE   = 4;
const ALIVE_TWO   = 5;
const ALIVE_THREE = 6;
const ALIVE_FOUR  = 7;
const ALIVE_FIVE  = 8;
const DB_THREE    = 9;
const THREE_FOUR  = 10
const DB_FOUR     = 11;


/* for direction */
const HORIZON        = 0;
const VERTICAL       = 1;
const LEFT_DIAGONAL  = 2;
const RIGHT_DIAGONAL = 3;


/* for identity representation */
const AI     = 1;
const PLAYER = -1;
const TIE    = 0;


const _match_type = (arr, len, pos, role, record) => { // {{{
	if (arr[pos] != role)
		return record;

	let rev_flag = false;
	if (pos * 2 >= len) {
		arr.reverse();
		record.reverse();
		pos = len - 1 - pos;
		rev_flag = true;
	}

	if ((pos == 0 || (pos >= 1 && arr[pos - 1] == -role)) && pos + 4 < len) { // left blocked
		if ( arr[pos + 1] == role &&
			 arr[pos + 2] == role &&
			 arr[pos + 3] == role &&
			 arr[pos + 4] == role) {
			for (let i = 0; i <= 4; i ++)
				record[pos + i] = ALIVE_FIVE;
		}
		else if (arr[pos + 1] == role &&
				 arr[pos + 2] == role &&
				 arr[pos + 3] == role &&
				 arr[pos + 4] == 0) {
			for (let i = 0; i <= 3; i ++)
				record[pos + i] = DIE_FOUR;
		}
		else if (arr[pos + 1] == role &&
				 arr[pos + 2] == role &&
				 arr[pos + 3] == 0) {
			if (arr[pos + 4] == role) {
				for (let i = 0; i <= 2; i ++)
					record[pos + i] = DIE_FOUR;
				record[pos + 4] = DIE_FOUR;
			}
			else if (arr[pos + 4] == 0) {
				for (let i = 0; i <= 2; i ++)
					record[pos + i] = DIE_THREE;
			}
		}
		else if (arr[pos + 1] == role &&
				 arr[pos + 2] == 0 &&
				 arr[pos + 4] == 0) {
			if (arr[pos + 3] == 0)
				record[pos] = record[pos + 1] = DIE_TWO;
			else if (arr[pos + 3] == role)
				record[pos] = record[pos + 1] = record[pos + 3] = DIE_THREE;
		}
		else if (arr[pos + 1] == 0 &&
				 arr[pos + 2] == role &&
				 arr[pos + 3] == role) {
			if (arr[pos + 4] == role)
				record[pos] = record[pos + 2] = record[pos + 3] = record[pos + 4] = DIE_FOUR;
			else
				record[pos] = record[pos + 2] = record[pos + 3] = DIE_FOUR;
		}
	}
	else {
		let l = 0, r = 0;
		while (0 <= pos - l && arr[pos - l] == 0)
			l ++;
		while (pos + r < len && arr[pos + r] != -role)
			r ++;

		if (l + r < 4)
			return record;

		if (r >= 4 &&
			arr[pos + 1] == role &&
			arr[pos + 2] == role &&
		    arr[pos + 3] == role &&
			arr[pos + 4] == role) {
			for (let i = 0; i <= 4; i ++)
				record[pos + i] = ALIVE_FIVE;
		}
		else if (r >= 3 &&
			arr[pos + 1] == role &&
			arr[pos + 2] == role &&
		    arr[pos + 3] == role &&
			(l >= 1 || r >= 4)) {
			for (let i = 0; i <= 3; i ++)
				record[pos + i] = ALIVE_FOUR;
		}
		else if (r >= 2 &&
			arr[pos + 1] == role &&
			arr[pos + 2] == role) {
			if (r >= 4 && arr[pos + 4] == role && arr[pos + 3] == 0)
				record[pos] = record[pos + 1] = record[pos + 2] = record[pos + 4] = ALIVE_FOUR;
			else
				record[pos] = record[pos + 1] = record[pos + 2] = ALIVE_THREE;
		}
		else if (r >= 1 &&
				 arr[pos + 1] == role) {
			if (r >= 3 && r[pos + 2] == 0 && r[pos + 3] == role)
				record[pos] = record[pos + 1] = record[pos + 3] = ALIVE_THREE;
			else
				record[pos] = record[pos + 1] = ALIVE_TWO;
		}
		else {
			if (r >= 4 &&
				arr[pos + 1] == 0 &&
				arr[pos + 2] == role &&
				arr[pos + 3] == role &&
				arr[pos + 4] == role)
					record[pos] = record[pos + 2] = record[pos + 3] = record[pos + 4] = ALIVE_FOUR;
			else if (r >= 3 &&
				arr[pos + 1] == 0 &&
				arr[pos + 2] == role &&
				arr[pos + 3] == role)
					record[pos] = record[pos + 2] = record[pos + 3] = ALIVE_THREE;
		}
	}

	if (rev_flag) {
		record.reverse();
		arr.reverse();
	}

	return record;
}; // }}}


const _line_check = (arr, len) => { // {{{
	let record_ai = new Array(len).fill(0);
	let record_player = new Array(len).fill(0);

	for (let i = 0; i < len; i ++) {
		if (record_ai[i] == 0)
			record_ai = _match_type(arr, len, i, AI, record_ai);
		if (record_player[i] == 0)
			record_player = _match_type(arr, len, i, PLAYER, record_player);
	}

	return [record_player, record_ai];
}; // }}}


class Evaluation {
	constructor(_chessboard) { // {{{
		this.chessboard = _chessboard;

		this.cnt = new Array();
		for (let i = 0; i < 2; i ++)
			this.cnt.push(new Array(12).fill(0));

		this.point_score = new Array();
		for (let i = 0; i < 15; i ++)
			this.point_score.push(new Array(15).fill(0));

		this.point_type = new Array();
		for (let i = 0; i < 2; i ++) {
			let x = new Array();

			for (let j = 0; j < 4; j ++) {
				let y = new Array();

				for (let k = 0; k < 15; k ++)
					y.push(new Array(15).fill(0))

				x.push(y);
			}

			this.point_type.push(x);
		}
	}// }}}


	_init_cnt() { // {{{
		this.cnt = new Array();
		for (let i = 0; i < 2; i ++)
			this.cnt.push(new Array(12).fill(0));
	} // }}}


	_init_point_score() { // {{{
		this.point_score = new Array();
		for (let i = 0; i < 15; i ++)
			this.point_score.push(new Array(15).fill(0));
	} // }}}


	_init_point_type() { // {{{
		this.point_type = new Array();
		for (let i = 0; i < 2; i ++) {
			let x = new Array();

			for (let j = 0; j < 4; j ++) {
				let y = new Array();

				for (let k = 0; k < 15; k ++)
					y.push(new Array(15).fill(0))

				x.push(y);
			}

			this.point_type.push(x);
		}
	} // }}}


	_horizontal_check() { // {{{
		let _record;
		for (let i = 0; i < 15; i ++) {
			_record = _line_check(this.chessboard[i], 15);

			this.point_type[0][HORIZON][i] = _record[0];
			this.point_type[1][HORIZON][i] = _record[1];
		}
	} // }}}


	_verital_check() { // {{{
		let arr;
		for (let i = 0; i < 15; i ++) {
			arr = [];
			for (let j = 0; j < 15; j ++)
				arr.push(this.chessboard[j][i]);

			_line_check(arr, 15);
		}
	} // }}}


	_right_diagonal_check() { // {{{
		let dx = 1, dy = 1, x, y ,arr;
		for (let i = 0; i <= 10; i ++) {
			arr = [];
			x = i, y = 0;
			for (let j = 0; j < 15 - i; j ++) {
				arr.push(this.chessboard[x][y]);
				x += dx, y += dy;
			}

			_line_check(arr, 15 - i); // lower part

			if (i == 0)
				continue;

			x = 0, y = i;
			arr = []
			for (let j = 0; j < 15 - i; j ++) {
				arr.push(this.chessboard[x][y]);
				x += dx, y += dy;
			}

			_line_check(arr, 15 - i); // upper part
		}
	} // }}}


	_left_diagonal_check() { // {{{
		let dx = 1, dy = -1, x, y, arr;
		for (let i = 1; i < 15; i ++) {
			if (i >= 4) {
				arr = [];
				x = 0, y = i;
				for (let j = 0; j <= i; j ++) {
					arr.push(this.chessboard[x][y]);
					x += dx, y += dy;
				}

				_line_check(arr, i + 1); // upper part
			}

			if (i <= 10) {
				x = i, y = 14;
				arr = [];
				for (let j = 0; j < 15 - i; j ++) {
					arr.push(this.chessboard[x][y]);
					x += dx, y += dy;
				}

				_line_check(arr, 15 - i); // lower part
			}
		}
	} // }}}


	evaluate(role) {
		/* init variants */
		let total = 0;

		this._init_point_type();
		this._init_point_score();
		this._init_cnt();


		/* check four directions */
		this._horizontal_check();
		this._verital_check();
		this._left_diagonal_check();
		this._right_diagonal_check();
	}
};



module.exports.Evaluation = Evaluation;
