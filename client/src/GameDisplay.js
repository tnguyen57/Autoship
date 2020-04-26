import React from 'react';
import './GameDisplay.css';

/**
 * Displays a blank board using SVG. The board accepts child nodes,
 * which are rendered onto the display.
 * Props:
 *  - width (int): the display width in pixels. Also used for the height.
 *  - ships ([record]): a list of ship types
 *  - shipBtn (boolean): whether to display a button to submit ship
 *    placements
 *  - onSubmitShips (function()): callback for the ship button.
 */
export default function GameDisplay(props) {
  const { width, ships, shipBtn, onSubmitShips, id } = props;
  return (
    <div className="game-display">
      <svg width={width} height={width} id={id}>
        {props.children}
      </svg>
      <div>
        {ships}
      </div>
      {shipBtn && <button onClick={onSubmitShips}>Submit Ship Placement</button>}
    </div>
  );
}
