import React from 'react';
import './App.css';
import GameState from './GameState'

function App() {
  return (
    <div className="App">
      <GameState id="self-board" size={10}/>
      <GameState id="opponent-board" size={10}/>
    </div>
  );
}

export default App;
