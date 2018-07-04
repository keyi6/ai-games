import React, { Component } from 'react';
import './App.css'

import TicTacToe from './TicTacToe/TicTacToe.js'

class App extends Component {
  render() {
    return (
      <div>
		<TicTacToe />
      </div>
    );
  }
}

export default App;
