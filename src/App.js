import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';

import './App.css'

import TicTacToe from './TicTacToe/TicTacToe.js'
import GoBang from './GoBang/GoBang.js'


class App extends Component {
	state = {
		choose: 0
	};


	render() {
		return (

        <div className="home">
            { this.state.choose === 0 ?
                <div className="menu">
                    <Row>
                        <Col span={12}>
                            <img src={ require('./gameboy.svg') } />
                        </Col>
                        <Col span={12}>
                            <div style={{width: '100%', height: '100%'}}>
                                <div className="menuBtn">
                                    <h1 onClick={ () => {this.setState({ choose: 1 }); } }>TicTacToe</h1>
                                </div>
                            </div>
                            <div style={{width: '100%', height: '100%'}}>
                                <div className="menuBtn">
                                    <h1 onClick={ () => {this.setState({ choose: 2 }); }  }> GoBang </h1>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div> : null }

            { this.state.choose === 1 ?
            <TicTacToe /> : null }

            { this.state.choose === 2 ?
            <GoBang /> : null }
        </div>
		);
	}
}

export default App;
