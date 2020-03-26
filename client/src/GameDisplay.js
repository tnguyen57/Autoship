import React from 'react';
import Square from './Square';

/**
 * Displays a blank board using SVG. The board accepts child nodes,
 * which are rendered onto the display.
 * Props:
 *  - width (int): the display width in pixels. Also used for the height.
 */
export default function GameDisplay(props) {
  const { width } = props;
  return (
    <svg width={width} height={width}>
      {props.children}
    </svg>
  );
}
