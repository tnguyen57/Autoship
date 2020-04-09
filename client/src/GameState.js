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

  async handleClick(x, y) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const res = await fetch('/api/move', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const json = await res.json();
    this.setState({
      [`${x},${y}`]: json.state
    });
  }

  render() {
    const {
      size,
      id
    } = this.props;
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
      <GameDisplay width={size * 50} id={id}>
        {moves}
      </GameDisplay>
    );
  }
}
