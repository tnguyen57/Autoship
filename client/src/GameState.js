import React from 'react';
import Square from './Square';
import GameDisplay from './GameDisplay';

/**
 * The main client game state for Autoship. The board keeps track
 * of existing square state (hit/miss/none), and handles user interaction.
 * Props:
 *  - size (int): the board size in squares
 */
export default class GameState extends React.Component {

  constructor(props) {
    super(props);
    const st = {};
    for(let x = 0; x < props.size; x++) {
      for(let y = 0; y < props.size; y++) {
        st[`${x},${y}`] = 'none';
      }
    }
    this.state = st;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(x, y) {
    this.setState({
      [`${x},${y}`]: Math.random() < 0.5 ? 'hit' : 'miss'
    });
  }

  render() {
    const size = this.props.size;
    const moves = [];
    for(const key in this.state) {
      const coords = key.split(',');
      moves.push(
        <Square
          key={key}
          x={+coords[0]}
          y={+coords[1]}
          boxSize={50}
          hit={this.state[key]}
          onClick={this.handleClick}
        />
      );
    }
    return (
      <GameDisplay size={size} squarePixels={50}>
        {moves}
      </GameDisplay>
    );
  }
}
