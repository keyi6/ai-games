import React from 'react';
import { Switch } from 'antd';
import './TicTacToe.css';

/* for chessboard */
const AI = 1;
const PLAYER = -1;
const TIE = 0;
const CANNOT_CLICK = 0;

/* for responsive layout */
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const BASE = HEIGHT < WIDTH ? HEIGHT : WIDTH;
const GIRD_HEIGHT = BASE / 5;
const BORDER_SIZE = Math.ceil(window.innerWidth / 40);
const BORDER_CSS = 'solid #FFF ' + BORDER_SIZE.toString() + 'px';
const CHESS_SIZE = (BASE / 7).toString() + 'px';
const FONT_SIZE = (BASE / 15).toString() + 'px';

const UPPER_HEIGHT = GIRD_HEIGHT + BORDER_SIZE;
const MIDDLE_HEIGHT = GIRD_HEIGHT + 2 * BORDER_SIZE;

/* for design */
const COLOR_ROW = ['#606470', '#7BCECC', '#F9CE00', '#4CAF50', '#FF9800'];       // background color


/* for game status check */
const is_same = (a, b, c) => {                                                   // check if 3 chess are the same
	return a === b && b === c && a === c && a !== 0;
};


const is_full = (chessboard) => {                                                // check if chessboard is full
	for (let i = 0; i < 3; i ++)
		for (let j = 0; j < 3; j ++)
			if (chessboard[i][j] === 0)
				return false;
	return true;
};


const is_just_started = (chessboard) => {                                        // if this game is just started
	let AI_cnt = 0, player_cnt = 0;
	for (let i = 0; i < 3; i ++)
		for (let j = 0; j < 3; j ++) {
			if (chessboard[i][j] === AI)
				AI_cnt ++;
			else if (chessboard[i][j] == PLAYER)
				player_cnt ++;
		}

	return player_cnt === 0 && AI_cnt <= 1;
}


const win_check = (chessboard) => {                                              // check if someone wins
	for (let i = 0; i < 3; i ++) {
		if (is_same(chessboard[i][0], chessboard[i][1], chessboard[i][2]))       // row
			return chessboard[i][0];
		if (is_same(chessboard[0][i], chessboard[1][i], chessboard[2][i]))       // col
			return chessboard[0][i];
	}

	if (is_same(chessboard[0][0], chessboard[1][1], chessboard[2][2]) ||         // diagonal
		is_same(chessboard[2][0], chessboard[1][1], chessboard[0][2]))
		return chessboard[1][1];

	return 0;                                                                    // nobody wins
};


const is_about_to_win = (chessboard, who) => {                                   // check if someone is one step from winning
	for (let i = 0; i < 3; i ++)
		for (let j = 0; j < 3; j ++)
			if (chessboard[i][j] === 0) {                                        // available place
				chessboard[i][j] = who;
				let winner = win_check(chessboard);
				chessboard[i][j] = 0;                                            // roll back

				if (winner === who)
					return { flag: true, best_move: [i, j] };
			}

	return { flag: false, best_move: [] };
};


const ai_move = (chessboard, alpha, beta) => {                                   // predict AI move
	let ret = { score: alpha, best_move: [] }, temp_score;

	let win_state = is_about_to_win(chessboard, AI);
	if (win_state.flag === true)                                                 // if AI is about to win
		ret = { score: AI, best_move: win_state.best_move };
	else if (is_full(chessboard))                                                // if chessboard is full
		ret.score = TIE;
	else {
		for (let i = 0; i < 3; i ++)
			for (let j = 0; j < 3; j ++)
				if (chessboard[i][j] === 0) {                                    // available place
					chessboard[i][j] = AI;                                       // place here
					temp_score = player_move(chessboard, ret.score, beta).score; // predict player move
					chessboard[i][j] = 0;                                        // rollback

					if (temp_score > ret.score) {                                // update score and best move
						ret.score = temp_score;
						ret.best_move = [i, j];
					}
				}
	}

	return ret;
};


const player_move = (chessboard, alpha, beta) => {                               // predict human move
	let ret = { score: beta, best_move: [] }, temp_score;

	let win_state = is_about_to_win(chessboard, PLAYER);
	if (win_state.flag === true)                                                 // if player is about to win
		ret = { score: PLAYER, best_move: win_state.best_move };
	else if (is_full(chessboard))                                                // if chessboard is full
		ret.score = TIE;
	else {
		for (let i = 0; i < 3; i ++)
			for (let j = 0; j < 3; j ++)
				if (chessboard[i][j] === 0) {                                    // available place
					chessboard[i][j] = PLAYER;                                   // place here
					temp_score = ai_move(chessboard, alpha, ret.score).score;    // predict AI move
					chessboard[i][j] = 0;                                        // rollback

					if (temp_score < ret.score) {                                // update score and best move
						ret.score = temp_score;
						ret.best_move = [i, j];
					}
				}
	}

	return ret;
};


class TicTacToe extends React.Component {
	state = {
		chessboard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],                           // chessboard
		displayBoard: ['', '', '', '', '', '', '', '', ''],                      // display board
		colorIdx: 0,                                                             // background color index
		clickStatus: AI,                                                         // 0 -> nobody move, 1 -> ai move, 2 -> human move
		firstHand: AI,                                                           // who plays first
		result: 'Let\'s play!'                                                   // help text
	};


	componentWillMount() {
		this.setState({ colorIdx: Math.round(Math.random() * 432) % 5 });        // get random background color
	};


	componentDidMount() {
		this.randomStart();
	}


	handleTie = () => {                                                          // if tie, display message and reset game
		this.setState({
			clickStatus: 0,
			result: 'Tie🤷‍️'
		});
	};


	handleWin = () => {                                                          // if player win, display message and reset game
		this.setState({
			clickStatus: 0,
			result: 'Good for you!🤘'
		});
	};


	handleLose = () => {                                                         // if player lose, display message and reset game
		this.setState({
			clickStatus: 0,
			result: 'Loser comes to bite me🤪'
		});
	};


	handleClick = (pos) => {                                                     // when player places chess
		let x = (pos - pos % 3) / 3, y = pos % 3;

		if (this.state.chessboard[x][y] === 0 &&                                 // available place
			this.state.clickStatus !== CANNOT_CLICK) {                           // available status
			let new_chessboard = this.state.chessboard,
				new_displayboard = this.state.displayBoard;

			new_chessboard[x][y] = PLAYER;                                       // update chessboard
			new_displayboard[pos] = '⭕️';                                        // update displayBoard

			this.setState({                                                      // update state
				clickStatus: PLAYER,
				chessboard: new_chessboard,
				displayBoard: new_displayboard
			});

			if (win_check(new_chessboard) === PLAYER)                            // Win
				this.handleWin();
			else if (win_check(new_chessboard) === AI)                           // Lose
				this.handleLose();
			else if (is_full(new_chessboard))                                    // Tie
				this.handleTie();
			else {                                                               // let AI move
				let res = ai_move(this.state.chessboard, PLAYER, AI);
				console.log(this.state.chessboard, res.best_move);
				x = res.best_move[0]; y = res.best_move[1];

				new_chessboard[x][y] = AI;                                       // update chessboard
				new_displayboard[x * 3 + y] = '❌';                              // update displayBoard

				this.setState({                                                  // update state
					chessboard: new_chessboard,
					displayBoard: new_displayboard
				});

				if (win_check(new_chessboard) === PLAYER)                        // Win
					this.handleWin();
				else if (win_check(new_chessboard) === AI)                       // Lose
					this.handleLose();
				else if (is_full(new_chessboard))                                // Tie
					this.handleTie();
			}
		}
	};


	handleClickMsg = () => {
		if (this.state.clickStatus === CANNOT_CLICK) {
			this.setState({
				clickStatus: this.state.firstHand,
				chessboard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
				displayBoard: ['', '', '', '', '', '', '', '', ''],
				result: 'Let\'s play again!'
			});

			if (this.state.firstHand == AI)
				this.randomStart();
		}
	};


	randomStart = () => {                                                        // random start a new game
		let pos = Math.round(Math.random() * 863) % 9;
		let x = (pos - pos % 3) / 3, y = pos % 3;

		let new_chessboard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
			new_displayboard = ['', '', '', '', '', '', '', '', ''];

		new_chessboard[x][y] = AI;                                               // update chessboard
		new_displayboard[pos] = '❌';                                            // update displayBoard

		this.setState({                                                          // update state
			result: 'Let\'s play again!',
			chessboard: new_chessboard,
			displayBoard: new_displayboard,
			clickStatus: PLAYER
		});

	};


	handleSwitch = (checked) => {                                                // switch first hand
		this.setState({ firstHand: checked ? AI : PLAYER });

		if (is_just_started(this.state.chessboard)) {
			if (checked)
				this.randomStart();                                              // random start a new game
			else
				this.setState({                                                  // clear, let PLAYER play
					clickStatus: this.state.firstHand,
					chessboard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
					displayBoard: ['', '', '', '', '', '', '', '', ''],
				});
		}
	}


	render() {                                                                   // html
		return (
			<div className="container" style={{ background: COLOR_ROW[this.state.colorIdx], width: WIDTH, height: HEIGHT }}>
				<div className="chessboard"><table>
					<tr className="row" style={{ height: UPPER_HEIGHT}}>
						<td className="gird" style={{ height: UPPER_HEIGHT, width: GIRD_HEIGHT,
								borderBottom: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 0)}>
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[0]} </div>
						</td>

						<td className="gird" style={{ height: UPPER_HEIGHT, width: MIDDLE_HEIGHT,
								borderLeft: BORDER_CSS, borderRight: BORDER_CSS, borderBottom: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 1)} >
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[1]} </div>
						</td>

						<td className="gird" style={{ height: UPPER_HEIGHT, width: GIRD_HEIGHT,
								borderBottom: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 2)} >
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[2]} </div>
						</td>
					</tr>


					<tr className="row" style={{ height: UPPER_HEIGHT }}>
						<td className="gird" style={{ height: UPPER_HEIGHT, width: GIRD_HEIGHT,
								borderBottom: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 3)}>
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[3]} </div>
						</td>

						<td className="gird" style={{ height: UPPER_HEIGHT, width: MIDDLE_HEIGHT,
								borderLeft: BORDER_CSS, borderRight: BORDER_CSS, borderBottom: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 4)} >
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[4]} </div>
						</td>

						<td className="gird" style={{ height: UPPER_HEIGHT, width: GIRD_HEIGHT,
								borderBottom: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 5)} >
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[5]} </div>
						</td>
					</tr>


					<tr className="row" style={{ height: UPPER_HEIGHT }}>
						<td className="gird" style={{ height: GIRD_HEIGHT, width: GIRD_HEIGHT }}
								onClick={this.handleClick.bind(this, 6)}>
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[6]} </div>
						</td>

						<td className="gird" style={{ height: GIRD_HEIGHT, width: MIDDLE_HEIGHT,
								borderLeft: BORDER_CSS, borderRight: BORDER_CSS }}
								onClick={this.handleClick.bind(this, 7)} >
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[7]} </div>
						</td>

						<td className="gird" style={{ height: GIRD_HEIGHT, width: GIRD_HEIGHT }}
								onClick={this.handleClick.bind(this, 8)} >
							<div style={{ fontSize: CHESS_SIZE }} className="chess"> {this.state.displayBoard[8]} </div>
						</td>
					</tr>


					<div className="status" style={{ fontSize: FONT_SIZE }} onClick={this.handleClickMsg}>
						{this.state.result}
					</div>

					<div className="status">
						You &nbsp; <Switch defaultChecked onChange={this.handleSwitch} /> &nbsp; AI go first.
					</div>
				</table></div>
			</div>
		)
	}

}

export default TicTacToe
