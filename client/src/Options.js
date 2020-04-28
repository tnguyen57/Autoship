import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
    },
}));

function Options() {
    const classes = useStyles();
    const [value1, setValue1] = React.useState('medium');
    const [value2, setValue2] = React.useState('10x10');
    const [helperText, setHelperText] = React.useState('Selected Default: ' + value1 + ' ' + value2);

    const handleRadioChange1 = (event) => {
        setValue1(event.target.value);
        setHelperText('Selected: ' + event.target.value + ' ' + value2);

    };
    const handleRadioChange2 = (event) => {
        setValue2(event.target.value);
        setHelperText('Selected: ' + value1 + ' ' + event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        history.push("/game");
    };

    let history = useHistory();

    return (
        <form onSubmit={handleSubmit}>
            <Grid container
                  direction="column"
                  justify="flex-end"
                  alignItems="center"
                  spacing={5}
            >
                <Grid item xs>
                    <h1>Game Options</h1>
                </Grid>
                <Grid item xs>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Opponent</FormLabel>
                        <RadioGroup row aria-label="difficulty" name="difficulty" value={value1} onChange={handleRadioChange1}>
                            <FormControlLabel value="easy" control={<Radio />} label="Easy AI" name="difficulty"/>
                            <FormControlLabel value="medium" control={<Radio />} label="Medium AI" name="difficulty"/>
                            <FormControlLabel value="hard" control={<Radio />} label="Hard AI" name="difficulty"/>
                            <FormControlLabel value="human" control={<Radio />} label="Human" name="difficulty"/>
                        </RadioGroup>
                        <FormLabel component="legend">Select Size</FormLabel>
                        <RadioGroup row aria-label="board_size" name="board_size" value={value2} onChange={handleRadioChange2}>
                            <FormControlLabel value="9x9" control={<Radio />} label="9x9" name="board_size"/>
                            <FormControlLabel value="10x10" control={<Radio />} label="10x10" name="board_size"/>
                            <FormControlLabel value="11x11" control={<Radio />} label="11x11" name="board_size"/>
                            <FormControlLabel value="12x12" control={<Radio />} label="12x12" name="board_size"/>
                        </RadioGroup>
                        <FormHelperText>{helperText}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs>
                    <Button type="submit"
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            disabled={true}
                    >
                        Play
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default Options;
