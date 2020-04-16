import React from 'react';
import './Ship.css';

/**
 * A ship icon displayed next to the game board.
 * Props:
 *  - name (string): the name of the ship
 *  - index (int): the index of the ship
 *  - length (int): the length of the ship, in squares
 *  - sunk (boolean): whether the ship has been sunk
 *  - selected (boolean): whether the ship is selected
 *  - onClick (function(int)): click event handler
 */
export default function Ship(props) {
  const height = 15;
  const shipStyle = {
    width: height * props.length,
    height: height
  };
  const underShipStyle = {
    width: shipStyle.width,
    height: 2
  };
  return (
    <div className="ship">
      <div
        style={shipStyle}
        className={
          `ship-icon
          ship-icon__${props.sunk ? 'sunk' : 'unsunk' }`
        }
        onClick={e => props.onClick && props.onClick(props.index)}
      />
      <div
        className={props.selected ? 'ship-underline__selected' : undefined}
        style={underShipStyle}
      />
      <span>{props.name}</span>
    </div>
  );
}
