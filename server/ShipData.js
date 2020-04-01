/**
 * This class contains the information of a ship on the board.
 * It will keep track of damages, it's position, and will allow for
 * guesses on it.
 */
const utilities = require("./utilities");

let ShipData = class{
    constructor(coordinateArray, id = 0){
        this._activePositions = coordinateArray;
        this._hitPositions = [];
        this._id = id;
    }

    /**
     * Given an x and y position, check to see if the ship is hit.
     * 
     * @param {Int} x - The x coordinate of the guess
     * @param {Int} y - The y coordinate of the guess
     * @modify - On hit, mark the position as hit.
     * @return {Guesses} - Returns if it is a hit/miss/skin
    */
    guess(x, y){
        for (let i  = 0; i < this._activePositions.length; i++){
            const currentPosition = this._activePositions[i]
            if (this._activePositions[i].x === x && this._activePositions[i].y === y){
                this._hitPositions.push(currentPosition);
                this._activePositions.splice(i, 1);
                if (this.isSunk()){
                    return utilities.Guesses.SINK;
                }
                return utilities.Guesses.HIT;
            }
        }
        return Guesses.MISS;
    }


    /**
    * Check to see if the ship is sunk
    * 
    * @return {Boolean} - Return true if the Ship has sunk. False, otherwise.
    */
    isSunk(){
        return this._activePositions.length === 0;
    }

    get id(){
        return this._id;
    }
}