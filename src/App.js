import React, { Component } from 'react';
import './App.css'

import TicTacToe from './TicTacToe/TicTacToe.js'
import GoBang from './GoBang/GoBang.js'

class App extends Component {
  render() {
    return (
      <div>
          <GoBang/>
      </div>
    );
  }
}

export default App;
