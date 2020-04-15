import React from 'react';
import './App.css';
import GameState from './GameState'

function RenderBoard() {
    return (
        <div>
            <GameState id="self-board" size={10}/>
            <GameState id="opponent-board" size={10}/>
        </div>
    );
}

export default RenderBoard;
