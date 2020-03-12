import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'

function HomeButton(props) {
    const { to = '/', children = null } = props;

    return (
        <div style={{width: '100%', height: '100%'}}>
            <div className="menuBtn">
                <h1>
                    <Link to={to}>
                        {children}
                    </Link>
                </h1>
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <div className='home'>
            <img style={{ height: '20vmin', width: 'auto' }} src={require('../assets/images/gameboy.svg')} />

            <div className="menu">
                <HomeButton to='/tic-tac-toe'>
                    TicTacToe
                </HomeButton>

                <HomeButton to='/go-bang'>
                    GoBang
                </HomeButton>
            </div>
        </div>
    );
};
