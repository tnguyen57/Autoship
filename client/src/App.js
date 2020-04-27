import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainMenu from "./MainMenu";
import RenderBoard from "./RenderBoard";

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
}

export default App;
