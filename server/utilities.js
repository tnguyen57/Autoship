/**
* Enum to contain the three choices of a guess
*/
const Guesses = Object.freeze ({ 
    HIT : Symbol("Hit"),
    MISS : Symbol("Miss"),
    SINK : Symbol("Sink")
});

module.exports =  Guesses;