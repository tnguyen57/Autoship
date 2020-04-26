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
 *  - ship (string): the ship state, one of 'none', 'present', 'tentative'
 *  - onClick (function(int, int)): click handler
 *  - onHover (function(int, int)): hover handler
 */
export default class Square extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
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

  handleRightClick(e) {
    const {
      x,
      y,
      onRightClick
    } = this.props;
    e.preventDefault();
    if(onRightClick) {
      onRightClick(x, y);
    }
  }

  handleHover(e) {
    const {
      x,
      y,
      onHover
    } = this.props;
    if(onHover) {
      onHover(x, y);
    }
  }

  render() {
    const {
      x,
      y,
      boxSize,
      hit,
      ship
    } = this.props;
    return (
      <g
        onClick={this.handleClick}
        onMouseOver={this.handleHover}
      >
        <rect
          x={x * boxSize}
          y={y * boxSize}
          width={boxSize}
          height={boxSize}
          className={`square-tile square-tile--${ship}`}
          stroke="black"
          fill="transparent"
          onContextMenu={this.handleRightClick}
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
