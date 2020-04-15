import React from 'react';
import Square from './Square';
import GameDisplay from './GameDisplay';

/**
 * The main client game state for Autoship. The board keeps track
 * of existing square state (hit/miss/none), and handles user interaction.
 * Props:
 *  - size (int): the board size in squares
 *  - ships ([record]): a list of pieces being used in the game
 * State:
 *  - squares ((x,y) -> string): the hit state of each square
 *  - shipData ([record]): a (possibly empty) list of ships with coordinate data
 */
export default class GameState extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: {},
      shipData: props.ships.map(ship => ({
        name: ship.name,
        length: ship.length,
        x: NaN,
        y: NaN,
        rotation: 'vertical',
        sunk: false
      }))
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(x, y) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const res = await fetch('/api/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    if(res.ok) {
      const json = await res.json();
      this.setState({
        squares: {
          [`${x},${y}`]: json.state,
          ...this.state.squares
        }
      });
    } else {
      console.log(`Server returned code ${res.status}. Dev please implement error handling.`);
    }
  }

  render() {
    const {
      size,
      ships,
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
            hit={this.state.squares[key] || 'none'}
            onClick={this.handleClick}
          />
        );
      }
    }
    return (
      <GameDisplay width={size * 50} id={id} ships={ships}>
        {moves}
      </GameDisplay>
    );
  }
}
