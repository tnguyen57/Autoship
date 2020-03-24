import React from 'react';
import Square from './Square';
import './GameDisplay.css';

/**
 * Displays a blank board using SVG. The board accepts child nodes,
 * which are rendered onto the display.
 * Props:
 *  - size (int): the board size in squares
 *  - squarePixels (int): the number of pixels wide each square is
 */
export default function GameDisplay(props) {
  const { size, squarePixels } = props;
  const pixelSize = size * squarePixels;
  const lines = [];
  for(let x = 1; x < size; x++) {
    lines.push(
      <line
        key={`column-${x}`}
        className="display-grid-line"
        x1={x * squarePixels}
        x2={x * squarePixels}
        y1={0}
        y2={pixelSize}
      />,
      <line
        key={`row-${x}`}
        className="display-grid-line"
        x1={0}
        x2={pixelSize}
        y1={x * squarePixels}
        y2={x * squarePixels}
      />
    );
  }
  return (
    <svg width={pixelSize} height={pixelSize}>
      {lines}
      {props.children}
    </svg>
  );
}
