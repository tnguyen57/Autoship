import React from 'react';
import './GameDisplay.css';

/**
 * Displays a blank board using SVG. The board accepts child nodes,
 * which are rendered onto the display.
 * Props:
 *  - width (int): the display width in pixels. Also used for the height.
 *  - ships ([record]): a list of ship types
 */
export default function GameDisplay(props) {
  const { width, ships, id } = props;
  return (
    <div className="game-display">
      <svg width={width} height={width} id={id}>
        {props.children}
      </svg>
      <div>
        {ships}
      </div>
    </div>
  );
}
