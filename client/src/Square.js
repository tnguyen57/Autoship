import React from 'react';
import './Square.css';

/**
 * A single square on a board. A square displays the hit/miss state
 * of each move.
 * Props:
 *  - x (int): the X coordinate, in squares
 *  - y (int): the y coordinate, in squares
 *  - boxSize (int): the size, in pixels, that this square takes up
 *  - hit (string): the hit state, one of 'none', 'hit', 'miss'
 *  - onClick (function(int, int)): click handler for when the player
 *    clicks (makes a move)
 */
export default class Square extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const {
      x,
      y,
      hit,
      onClick
    } = this.props;
    if(onClick && hit === 'none') {
      onClick(x, y);
    }
  }

  render() {
    const {
      x,
      y,
      boxSize,
      hit
    } = this.props;
    return (
      <g onClick={this.handleClick}>
        <rect
          x={x * boxSize}
          y={y * boxSize}
          width={boxSize}
          height={boxSize}
          stroke="black"
          fill="transparent"
        />
        {hit !== 'none' && (
          <circle
            cx={(x + 0.5) * boxSize}
            cy={(y + 0.5) * boxSize}
            r={boxSize / 2 * 0.8}
            className={`square--${hit}`}
          />
        )}
      </g>
    );
  }
}
