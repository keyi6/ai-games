import React from 'react';
import { Switch, Slider, Col, Row } from 'antd';
import './GoBang.css';

let A = require('./negamax');
let ai_move = A.ai_move;
let win_check = A.win_check;
let set_depth = A.set_max_depth;

/* for chessboard */
const AI = 1;
const PLAYER = -1;
const TIE = 0;
const CANNOT_CLICK = 0;

/* for responsive layout */
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
const BASE = HEIGHT < WIDTH ? HEIGHT : WIDTH;
const BOARD_SIZE = BASE * 0.6;

const MARGIN_U = ((HEIGHT - BOARD_SIZE) / 2).toString() + 'px';
const MARGIN_L = ((WIDTH - BOARD_SIZE) / 2).toString() + 'px';


const RATE = Math.round(BOARD_SIZE / 15);
const OFFSET = Math.ceil((BOARD_SIZE - RATE * 14) * 0.5);
const RADIUS = RATE * 0.4;


/* for design */
const COLOR_ROW = ['#606470', '#3c79ce', '#F9CE00', '#4CAF50', '#FF9800'];       // background color

let ctx;
let cut_cnt, search_cnt, score;

class GoBang extends React.Component {
    state = {
        colorIdx: 0,                                                             // background color index
        chessboard: [],  // chessboard
        clickStatus: AI,                                                         // 0 -> nobody move, 1 -> ai move, 2 -> human move
        firstHand: AI,                                                           // who plays first
        result: 'Let\'s play!',                                                // help text
        cnt: 0,
		end: true,
        cur_pos_x: 0,
        cur_pos_y: 0
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
			end: true,
            result: 'Good for you!🤘'
        });
    };


    handleLose = () => {                                                         // if player lose, display message and reset game
        this.setState({
			end: true,
            result: 'Loser comes to bite me🤪'
        });
    };


    handleClick = (e) => {                                                     // when player places chess
        let x = e.clientX - OFFSET - (WIDTH - BOARD_SIZE) / 2;
        let y = e.clientY - OFFSET - (HEIGHT - BOARD_SIZE) / 2;
        let nx = Math.round(x / RATE), ny = Math.round(y / RATE);

        let t = this.state.chessboard, q;
        if (t[nx][ny] === 0) {
            this.draw(nx, ny, this.state.cnt);
            t[nx][ny] = PLAYER;

			q = win_check(t);
			if (q == PLAYER) { this.handleWin();  return; }

            setTimeout(() => {
                let p = ai_move(t);
                search_cnt = p[1];
                cut_cnt = p[2];
                score = p[3];
                t[p[0][0]][p[0][1]] = AI;
                this.draw(p[0][0], p[0][1], this.state.cnt + 1);
				

                this.setState({
                    cnt: this.state.cnt + 2,
                    chessboard: t,
                    clickStatus: -this.state.clickStatus
                });

				q = win_check(t);
				if (q == AI) { this.handleLose();  return; }
            }, 10);
        }
    };


    handleMove = (e) => {
        let x = e.clientX - OFFSET - (WIDTH - BOARD_SIZE) / 2;
        let y = e.clientY - OFFSET - (HEIGHT - BOARD_SIZE) / 2;
        x = Math.round(x / RATE);
        y = Math.round(y / RATE);
        this.setState({
            cur_pos_x: x,
            cur_pos_y: y
        });
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
        this.draw(7, 7, 0);
        let t = this.state.chessboard;
        t[7][7] = AI;
        this.setState({
            chessboard: t,
            cnt: 1,
			end: false
        });
    };


    handleSwitch = (checked) => {                                                // switch first hand
        if (checked && this.state.cnt === 0)
            this.randomStart();
        this.setState({ firstHand: checked ? AI : PLAYER });
    };


    handleSlide = (v) => {
        set_depth(v);
    };


    render() {                                                                   // html
        return (
            <div className="container"
                 style={{
                    height: (HEIGHT + 1).toString() + 'px',
                    width: WIDTH.toString() + 'px',
                    backgroundColor: COLOR_ROW[this.state.colorIdx]
                }}
            >

                <canvas id="board"
                        onClick={ this.handleClick }
                        onMouseMove={ this.handleMove }
                        style={{
                            position: 'absolute',
                            top: MARGIN_U,
                            left: MARGIN_L
                        }}
                />

                <div className="info" style={{
                    top: Math.round(HEIGHT * 0.78).toString() + 'px',
                    left: 0,
                    width: WIDTH.toString() + 'px'
                }}>
					{this.state.end ? this.state.result : null}
                    clicking at [{ this.state.cur_pos_x }, { this.state.cur_pos_y }]
                    search: { search_cnt }, cut: { cut_cnt }, score: { score }
                </div>

                <div className="status" style={{
                    top: Math.round(HEIGHT * 0.85).toString() + 'px',
                    width: WIDTH.toString()
                }}>
                    You &nbsp; <Switch onChange={this.handleSwitch} /> &nbsp; AI go first.

                </div>

                <div className="status" style={{
                    width: WIDTH.toString() + 'px',
                    top: Math.round(HEIGHT * 0.89).toString() + 'px',
                    lineHeight: '35px'
                }}>
                    <Row>
                        <Col offset={7} span={5}>
                            Search depth setting
                        </Col>

                        <Col span={5}>
                            <Slider defaultValue={3} max={5} min={1} onChange={this.handleSlide} />
                        </Col>
                    </Row>

                </div>
            </div>
        )
    }
}


export default GoBang
