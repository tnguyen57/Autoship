import React from 'react';
import './GameDisplay.css';

/**
 * Displays a blank board using SVG. The board accepts child nodes,
 * which are rendered onto the display.
 * Props:
 *  - width (int): the display width in pixels. Also used for the height.
 */
export default function GameDisplay(props) {
  const { width, id } = props;
  return (
    <svg width={width} height={width} id={id} className="game-display">
      {props.children}
    </svg>
  );
}
