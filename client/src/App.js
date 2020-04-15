import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import MainMenu from "./MainMenu";
import RenderBoard from "./RenderBoard";

/**
 * Builds simple ship data.
 */
function ship(name, length) {
  return { name, length };
}

function App() {

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" exact component={MainMenu}/>
                    <Route path="/game" component={RenderBoard}/>
                </Switch>
            </div>
        </Router>
    );
  // ships for some variant of the game
  const ships = [
    ship('carrier', 5),
    ship('battleship', 4),
    ship('destroyer', 3),
    ship('submarine', 3),
    ship('patrol boat', 2)
  ];

}

export default App;
