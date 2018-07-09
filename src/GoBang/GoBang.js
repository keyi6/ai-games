import React from 'react';
import { Switch } from 'antd';
import './GoBang.css';

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


/* for game status check
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
*/

class GoBang extends React.Component {
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
    };


    handleClickMsg = () => {
        if (this.state.clickStatus === CANNOT_CLICK) {
            this.setState({
                clickStatus: this.state.firstHand,
                chessboard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
                displayBoard: ['', '', '', '', '', '', '', '', ''],
                result: 'Let\'s play again!'
            });

            if (this.state.firstHand === AI)
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

        /*
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
        */
    };


    render() {                                                                   // html
        return (
            <div className="container">
            </div>
        )
    }

}

export default GoBang
