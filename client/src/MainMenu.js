import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

function MainMenu() {
    return (
        <div style={{ padding: '200px' }}>
            <Grid
                container
                direction="column"
                justify="flex-end"
                alignItems="center"
                spacing={5}
            >
                <Grid item xs>
                    <h1>Welcome to Autoship!</h1>
                </Grid>
                <Grid item xs>
                    <Link to={'/game'} style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">Quick Play (10x10 Medium AI)</Button>
                    </Link>
                </Grid>
                <Grid item xs>
                    <Link to={'/options'} style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary">Game Options</Button>
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}

export default MainMenu;
