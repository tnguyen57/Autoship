
/**
 * This class will store the game state of a players board on the server.
 * This class will store current guesses and ship positions
 */

const ShipData = require("./ShipData");
const Guesses = require("./utilities");

let BoardData = class {
    /**
    * Construct the board given an array of ships.
    * 
    * @param {Array[ShipData]} shipArray- Contains all of the ships to the board.
    * @param {Array[ShipData]} xSize- The 'width' of the board
    * @param {Array[ShipData]} ySize- The 'length' of the board
    */
    constructor(shipArray, xSize = 10, ySize = 10) {
        
        this._guesses = [];
        this._sunkShip = [];
        this._remainingShips = shipArray;
        this._xSize = xSize;
        this.ySize = ySize;

        for (let i = 0; i < shipArray.length; i++) {
            const ship = shipArray[i];
            if (ship.isSunk()) {
                this._remainingShips.splice(i, 1);
                this._sunkShip.push(ship);
            }
        }  
    }

    /**
     * Make a guess on the board
     * @param {Int} x - x coordinate of the guess
     * @param {Int} y - y coordinate of the guess
     * @modify - Make the ship as sunken/hit if the guess succeed
     * @return {Guesses} - Returns whether the guess is a hit/miss/sink.
     */
    guess(x, y) {
        this._guesses.push({x: x, y: y});

        for (let i = 0; i < this._remainingShips.length; i++) {
            let ship = this._remainingShips[i];
            const classification = ship.guess(x, y)
            if (classification === Guesses.HIT) {
                return Guesses.HIT;

            }
            else if (classification === Guesses.SINK) {
                this._remainingShips.splice(i, 1);
                this._sunkShip.push(ship);
                return Guesses.SINK;
            }
        }
        return Guesses.MISS;
    }

    /**
    * Return the number of ships remaining.
    * 
    * @return {Int} - Corresponds to the number of ships on the board.
    */
    get shipCount() {  
        return this._remainingShips.length;
    }

    /**
    * Returns the ID of the last sunk simp
    * 
    * @return {Int} - Returns the id of the last sunk ship. Return null if no ship sunk.
    */
    get lastSunkID() {
        if (this._sunkShip.length === 0){
            return null;
        }
        return this._sunkShip[this._sunkShip.length - 1].id;
    }

    /**
    * Returns the width of the board of the last sunk simp
    * 
    * @return {Int} - Returns the width of the board. Stored in xSize
    */
    get width() {
        return this._xSize;
    }

    /**
    * Returns the length of the board of the last sunk simp
    * 
    * @return {Int} - Returns the length of the board. Stored in ySize
    */
    get length() {
        return this._ySize;
    }
}

module.exports = BoardData;
