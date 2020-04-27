import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

function MainMenu() {
    return (
        <div>
            <h1>Welcome to Autoship!</h1>
            <Link to={'/game'}>
                <h1>Quick Play (10x10 Medium AI)</h1>
            </Link>
            <Link to={'/'}>
                <h1>Game Options</h1>
            </Link>
        </div>
    );
}

export default MainMenu;
