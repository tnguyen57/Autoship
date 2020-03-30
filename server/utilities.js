/**
 * Contains miscellaneous functions and classes.
 */


let Coordinate = {x: a , y: b};


const Guesses = Object.freeze({
    /**
     * Enum to contain the three choices of a guess
     */
    HIT : Symbol("Hit"),
    MISS : Symbol("Miss"),
    SINK : Symbol("Sink")
});