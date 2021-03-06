import React from 'react';
import Ship from './Ship';
import Square from './Square';
import GameDisplay from './GameDisplay';

/**
 * The main client game state for Autoship. The board keeps track
 * of existing square state (hit/miss/none), and handles user interaction.
 * Props:
 *  - size (int): the board size in squares
 *  - ships ([record]): a list of pieces being used in the game
 *  - kind (string): the board kind, one of 'self', 'opponent'
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
        placement: 'none',
        sunk: props.kind === 'self'
      })),
      selectedShipIndex: -1,
      frozen: false
    };
    this.submitMove = this.submitMove.bind(this);
    this.submitShips = this.submitShips.bind(this);
    this.selectShip = this.selectShip.bind(this);
    this.moveSelectedShipToSquare = this.moveSelectedShipToSquare.bind(this);
    this.rotateSelectedShip = this.rotateSelectedShip.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  handleSquareClick(x, y) {
    const { kind } = this.props;
    if(kind === 'self') {
      this.confirmSelectedShipPlacement();
    } else {
      this.submitMove(x, y);
    }
  }

  /**
   * Submits a move to the server.
   */
  async submitMove(x, y) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const res = await fetch('/api/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ x, y })
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

  /**
   * Submits the current ship placements to the server.
   */
  async submitShips() {
    const res = await fetch('/api/placeShips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.shipData.map(ship => ({
        name: ship.name,
        length: ship.length,
        x: ship.x,
        y: ship.y,
        rotation: ship.rotation
      })))
    });
    if(res.ok) {
      this.setState({
        frozen: true
      });
    } else {
      console.log(`Server returned code ${res.status}. Dev please implement error handling.`);
    }
  }

  /**
   * Comfirms ship placement and marks the selected ship as placed
   * in its current location.
   */
  confirmSelectedShipPlacement() {
    const { size } = this.props;
    this.setState(state => {
      const { selectedShipIndex, shipData } = state;
      if(selectedShipIndex >= 0) {
        // determine if there is overlap with other ships.
        // if there is, short-circuit.
        const ship = shipData[selectedShipIndex];
        const squaresWithShips = this.getSquaresWithShips();
        const { length } = ship;
        // adjust these so that they point to the upper-left corner
        let { x, y } = ship;
        switch(ship.rotation) {
          case 'vertical':
            if(y + length > size) {
              y = size - length;
            }
            for(let i = 0; i < length; i++) {
              if(squaresWithShips[`${x},${y + i}`] === 'present') {
                return {};
              }
            }
            break;
          case 'horizontal':
            if(x + length > size) {
              x = size - length;
            }
            for(let i = 0; i < length; i++) {
              if(squaresWithShips[`${x + i},${y}`] === 'present') {
                return {};
              }
            }
            break;
          default:
            break;
        }
        // there is no overlap with other ships
        const newShipData = shipData.slice();
        newShipData[selectedShipIndex] = {
          ...ship,
          x, y,
          sunk: false,
          placement: 'present'
        };
        return {
          shipData: newShipData,
          selectedShipIndex: -1
        }
      } else {
        return {};
      }
    });
  }

  /**
   * Rotates the selected tentatively placed ship.
   */
  rotateSelectedShip() {
    this.setState(state => {
      const { selectedShipIndex, shipData } = state;
      if(selectedShipIndex >= 0) {
        // toggle rotation of the selected ship
        const newRotation =
          shipData[selectedShipIndex].rotation === 'vertical' ? 'horizontal' : 'vertical';
        const newShipData = shipData.slice();
        newShipData[selectedShipIndex] = {
          ...newShipData[selectedShipIndex],
          rotation: newRotation
        };
        return {
          shipData: newShipData
        };
      } else {
        return {};
      }
    });
  }

  /**
   * Moves the tentatively selected ship to the given square.
   */
  moveSelectedShipToSquare(x, y) {
    this.setState(state => {
      const { selectedShipIndex, shipData } = state;
      // set the selected ship to the hovered square
      const newShipData = shipData.slice();
      if(selectedShipIndex >= 0) {
        const ship = newShipData[selectedShipIndex];
        newShipData[selectedShipIndex] = {
          ...ship,
          x, y
        }
      }
      return {
        shipData: newShipData
      };
    });
  }

  /**
   * Selects the given ship and deselects any previously selected ship.
   */
  selectShip(idx) {
    if(this.props.kind === 'self') {
      this.setState(state => {
        // do not allow edits of frozen boards
        if(state.frozen) {
          return {};
        }
        const { selectedShipIndex, shipData } = state;
        const newShipData = shipData.slice();
        if(selectedShipIndex >= 0) {
          newShipData[selectedShipIndex] = {
            ...shipData[selectedShipIndex],
            x: NaN,
            y: NaN,
            placement: 'none'
          }
        }
        newShipData[idx] = {
          ...shipData[idx],
          sunk: true,
          placement: 'tentative'
        }
        return {
          shipData: newShipData,
          selectedShipIndex: idx
        }
      });
    }
  }

  /**
   * Returns a map of square keys to the state of any ship present on
   * that square.
   */
  getSquaresWithShips() {
    const { size } = this.props;
    const res = {};
    for(const ship of this.state.shipData) {
      const { length, rotation, placement } = ship;
      let { x, y } = ship;
      if(placement !== 'none') {
        // set squares with ships on them. Present ships take
        // priority over tentative ships.
        switch(rotation) {
          case 'vertical':
              if(y + length > size) {
                y = size - length;
              }
              for(let i = 0; i < length; i++) {
                const key = `${x},${y + i}`;
                if(res[key] !== 'present') {
                  res[key] = placement;
                }
              }
            break;
          case 'horizontal':
              if(x + length > size) {
                x = size - length;
              }
              for(let i = 0; i < length; i++) {
                const key = `${x + i},${y}`;
                if(res[key] !== 'present') {
                  res[key] = placement;
                }
              }
            break;
          default:
            break;
        }
      }
    }
    return res;
  }

  render() {
    const {
      kind,
      size,
      id
    } = this.props;
    const {
      selectedShipIndex,
      shipData,
      squares,
      frozen
    } = this.state;
    // highlight squares where ships are
    const shipHighlight = this.getSquaresWithShips();
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
            hit={squares[key] || 'none'}
            ship={shipHighlight[key] || 'none'}
            onClick={this.handleSquareClick}
            onRightClick={this.rotateSelectedShip}
            onHover={this.moveSelectedShipToSquare}
          />
        );
      }
    }
    const shipComponents = shipData.map((ship, idx) => (
      <Ship
        key={ship.name}
        index={idx}
        name={ship.name}
        length={ship.length}
        sunk={ship.sunk}
        selected={selectedShipIndex === idx}
        onClick={this.selectShip}
      />
    ));
    return (
      <GameDisplay
        width={size * 50}
        id={id}
        ships={shipComponents}
        shipBtn={kind === 'self' && !frozen && shipData.reduce((a, ship) => a && !ship.sunk, true)}
        onSubmitShips={this.submitShips}
      >
        {moves}
      </GameDisplay>
    );
  }
}
