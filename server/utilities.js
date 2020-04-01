/**
 * Contains miscellaneous functions and classes.
 */
let Coordinate = {x: a , y: b};

/**
* Enum to contain the three choices of a guess
*/
const Guesses = Object.freeze({
    
    HIT : Symbol("Hit"),
    MISS : Symbol("Miss"),
    SINK : Symbol("Sink")
});