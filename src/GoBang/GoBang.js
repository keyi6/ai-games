import React from 'react';
import { Switch } from 'antd';
import './GoBang.css';

let A = require('./negamax');
let ai_move = A.ai_move;

/* for chessboard */
const AI = 1;
const PLAYER = -1;
const TIE = 0;
const CANNOT_CLICK = 0;

/* for responsive layout */
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const BASE = HEIGHT < WIDTH ? HEIGHT : WIDTH;
const BOARD_SIZE = BASE * 0.5;
const CHESS_SIZE = (BASE / 7).toString() + 'px';
const FONT_SIZE = (BASE / 15).toString() + 'px';


const MARGIN_U = ((HEIGHT- BOARD_SIZE) / 2).toString() + 'px';
const MARGIN_L = ((WIDTH - BOARD_SIZE) / 2).toString() + 'px';
const SIZE = BOARD_SIZE.toString() + 'px';


const RATE = Math.round(BOARD_SIZE / 15);
const OFFSET = Math.ceil((BOARD_SIZE - RATE * 14) / 2);
const RADIUS = RATE * 0.4;


/* for design */
const COLOR_ROW = ['#606470', '#3c79ce', '#F9CE00', '#4CAF50', '#FF9800'];       // background color

let ctx;


class GoBang extends React.Component {
    state = {
        colorIdx: 0,                                                             // background color index
        chessboard: [],  // chessboard
        clickStatus: AI,                                                         // 0 -> nobody move, 1 -> ai move, 2 -> human move
        firstHand: AI,                                                           // who plays first
        result: 'Let\'s play!',                                                // help text
        cnt: 0
    };


    chessboardInit() {
        let t = [];
        for (let i = 0; i < 15; i ++)
            t.push(new Array(15).fill(0));

        this.setState({ chessboard: t });
    };


    componentWillMount() {
        this.chessboardInit();
        this.setState({ colorIdx: Math.round(Math.random() * 432) % 5 });        // get random background color
    };


    componentDidMount() {
        let canvas = document.getElementById('board');
        canvas.width = BOARD_SIZE;
        canvas.height = BOARD_SIZE;
        ctx = canvas.getContext('2d');

        for (let i = 0; i < 15; i++) {
            ctx.moveTo(OFFSET + i * RATE, OFFSET);
            ctx.lineTo(OFFSET + i * RATE, BOARD_SIZE - OFFSET);
            ctx.stroke();

            ctx.moveTo(OFFSET             , i * RATE + OFFSET);
            ctx.lineTo(BOARD_SIZE - OFFSET, i * RATE + OFFSET);
            ctx.stroke();
        }
    }


    draw(x, y, turn) {
        let nx = x * RATE + OFFSET;
        let ny = y * RATE + OFFSET;

        if (turn % 2 === 0)
            ctx.fillStyle= " #000";
        else
            ctx.fillStyle= " #FFF";

        ctx.beginPath();
        ctx.arc(nx, ny, RADIUS, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

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


    handleClick = (e) => {                                                     // when player places chess
        let x = e.clientX - OFFSET - (WIDTH - BOARD_SIZE) / 2;
        let y = e.clientY - OFFSET - (HEIGHT - BOARD_SIZE) / 2;
        let nx = Math.round(x / RATE), ny = Math.round(y / RATE);

        let t = this.state.chessboard;
        if (t[nx][ny] === 0) {
            console.log('clicked! drawing...');
            this.draw(nx, ny, this.state.cnt);
            console.log('drawed!')

            t[nx][ny] = PLAYER;


            let p = ai_move(t);

            t[p[0]][p[1]] = AI;
            this.draw(p[0], p[1], this.state.cnt + 1);

            this.setState({
                cnt: this.state.cnt + 2,
                chessboard: t,
                clickStatus: -this.state.clickStatus
            });

        }
    };


    handleClickMsg = () => {
        if (this.state.clickStatus === CANNOT_CLICK) {
            this.setState({
                clickStatus: this.state.firstHand,
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
            <div className="container"
                 style={{
                    height: HEIGHT.toString() + 'px',
                    width: WIDTH.toString() + 'px',
                    backgroundColor: COLOR_ROW[this.state.colorIdx]
                }}
            >

                <canvas id="board"
                        onClick={this.handleClick}
                        style={{
                            position: 'absolute',
                            top: MARGIN_U,
                            left: MARGIN_L
                        }}
                />
            </div>
        )
    }

}

export default GoBang
