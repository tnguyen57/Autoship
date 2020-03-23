import React from 'react';

const GRID_SIZE = 50;

export class Square extends React.Component {
    
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
    
  handleClick(e) {
    const { x, y } = this.props;
    this.props.onClick(x, y);
  }

  render() {
    const {
      x,
      y,
      hit
    } = this.props;
    const radius = 20;
    const color = {
      hit: 'red',
      miss: 'black',
      none: 'white'
    }[hit];
    return (
      <circle
        cx={x * GRID_SIZE + radius}
        cy={y * GRID_SIZE + radius}
        r={radius}
        fill={color}
        onClick={this.handleClick}
      />
    );
  }
}

export class GameBoard extends React.Component {
    
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
    console.log(`${x}, ${y}`);
    this.setState({
      [`${x},${y}`]: Math.random() < 0.5 ? 'hit' : 'miss' 
    });
  }
  
  render() {
    const size = this.props.size * GRID_SIZE;
    const moves = [];
    for(const key in this.state) {
      const coords = key.split(',');
      moves.push(
        <Square
          key={key}
          x={coords[0]}
          y={coords[1]}
          hit={this.state[key]}
          onClick={this.handleClick}
        />
      );
    }
    const lines = [];
    for(let x = 0; x < size; x++) {
      for(let y = 0; y < size; y++) {
        lines.push(
          <line
            key={`line-${x},${y}`}
            x1={x}
            x2={x}
            y1={0}
            y2={size * GRID_SIZE}
          />
        );
      }
    }
    return (
      <svg width={size} height={size}>
        {moves}
        {lines}
      </svg>
    );    
  }
}