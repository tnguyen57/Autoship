
/**
 * This class will store the game state of a players board on the server.
 * This class will store current guesses and ship positions
 */

const Guesses = require("./utilities");

const BoardData = class {
    /**
    * Construct the board given an array of ships.
    *
    * @param {Array.<ShipData>} shipArray - Contains all of the ships
    * @param {Array.<ShipData>} [xSize = 10] - The 'width' of the board
    * @param {Array.<ShipData>} [ySize = 10] - The 'length' of the board
    */
    constructor(shipArray, xSize = 10, ySize = 10) {
        this._guesses = [];
        this._sunkShip = [];
        this._remainingShips = shipArray;
        this._width = xSize;
        this._height = ySize;

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
     * @return {{id: Int, result:Guesses}} - Returns whether the guess is
     *                                       a hit/miss/sink and the id of
     *                                       the ship if hit/sink
     */
    guess(x, y) {
        this._guesses.push({x: x, y: y});

        for (let i = 0; i < this._remainingShips.length; i++) {
            const ship = this._remainingShips[i];
            const classification = ship.guess(x, y);
            if (classification === Guesses.HIT) {
                return {id: ship.id, result: Guesses.HIT};
            } else if (classification === Guesses.SINK) {
                this._remainingShips.splice(i, 1);
                this._sunkShip.push(ship);
                return {id: ship.id, result: Guesses.SINK};
            }
        }
        return {id: null, result: Guesses.MISS};
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
    * @return {Int} - Returns the id of the last sunk ship.
    *                 Return null if no ship sunk.
    */
    get lastSunkID() {
        if (this._sunkShip.length === 0) {
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
        return this._width;
    }

    /**
    * Returns the height of the board of the last sunk simp
    *
    * @return {Int} - Returns the length of the board. Stored in ySize
    */
    get height() {
        return this._height;
    }
};

module.exports = BoardData;
