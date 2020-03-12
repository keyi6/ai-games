import React from 'react';
import { Switch, HashRouter as Router, Route } from 'react-router-dom';
/* pages */
import Home from './Home';
import TicTacToe from './TicTacToe'
import GoBang from './GoBang'
/* styles */
import './App.css'

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/go-bang" component={GoBang} />
                <Route path="/tic-tac-toe" component={TicTacToe} />
            </Switch>
        </Router>
    );
}
