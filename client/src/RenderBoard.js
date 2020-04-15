import React from 'react';
import './App.css';
import GameState from './GameState';

/**
 * Builds simple ship data.
 */
function ship(name, length) {
    return { name, length };
}

function RenderBoard() {
    // ships for some variant of the game
    const ships = [
        ship('carrier', 5),
        ship('battleship', 4),
        ship('destroyer', 3),
        ship('submarine', 3),
        ship('patrol boat', 2)
    ];
    return (
        <div>
            <GameState id="self-board" size={10} ships={ships}/>
            <GameState id="opponent-board" size={10} ships={ships}/>
        </div>
    );
}

export default RenderBoard;
