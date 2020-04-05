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
    this.state = {};
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
    for(let x = 0; x < size; x++) {
      for(let y = 0; y < size; y++) {
        const key = `${x},${y}`;
        moves.push(
          <Square
            key={key}
            x={x}
            y={y}
            boxSize={50}
            hit={this.state[key] || 'none'}
            onClick={this.handleClick}
          />
        );
      }
    }
    return (
      <GameDisplay width={size * 50}>
        {moves}
      </GameDisplay>
    );
  }
}
