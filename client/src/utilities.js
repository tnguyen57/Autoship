/**
 * Contains miscellaneous functions and classes.
 */



let Coordinate = class{
    /**
     * A simple immutable class to contains coordinate information
     * @param {Int} x 
     * @param {Int} y 
     */
    constructor(x, y){
        this._x = x;
        this._y = y;
    }

    get x(){
        return this._x;
    }

    get y(){
        return this._y;
    }
}


let EnumGuess = {
    /**
     * Enum to contain the three choices of a guess
     */
    HIT : 1,
    MISS : 2,
    SINK : 3
}