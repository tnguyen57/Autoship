import React from 'react';
import './Ship.css';

/**
 * A ship icon displayed next to the game board.
 * Props:
 *  - name (string): the name of the ship
 *  - length (int): the length of the ship, in squares
 *  - sunk (boolean): whether the ship has been sunk
 */
export default function Ship(props) {
  const height = 15;
  const shipStyle = {
    width: height * props.length,
    height: height
  };
  return (
    <div className="ship">
      <div
        style={shipStyle}
        className={`ship-icon ship-icon__${props.sunk ? 'sunk' : 'unsunk' }`}
      />
      <span>{props.name}</span>
    </div>
  );
}
