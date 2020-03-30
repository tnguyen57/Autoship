/**
 * This class contains the information of a ship on the board.
 * It will keep track of damages, it's position, and will allow for
 * guesses on it.
 */


require("./utilities");

let GameShipData = class{
    constructor(coordinateArray, id = 0){
        this._activePositions = coordinateArray;
        this._hitPositions = new Array();
        this._id = id;
    }

    guess(x, y){
        /**
         * Given an x and y position, check to see if the ship is hit.
         * 
         * @param {Int} x - The x coordinate of the guess
         * @param {Int} y - The y coordinate of the guess
         * @modify - On hit, mark the position as hit.
         * @return {Guesses} - Returns if it is a hit/miss/skin
         */
        for (let i  = 0; i < this._activePositions.length; i++){
            currentPosition = this._activePositions[i]
            if (this._activePositions[i].x == x && this._activePositions[i].y == y){
                this._hitPositions.push(currentPosition);
                this._activePositions.splice(i, 1);
                if (this.isSunk()){
                    return Guesses.SINK;
                }
                return Guesses.HIT;
            }
        }
        return Guesses.MISS;
    }

    isSunk(){
        /**
         * @return {Boolean} - Return if the Ship has sunk.
         */
        return this._activePositions.length == 0;
    }

    get id(){
        return this._id;
    }
}