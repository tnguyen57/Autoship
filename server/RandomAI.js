/**
 * This class will act as a random AI. Creates a random board and make random guesses.
 */
const ShipData = require("./ShipData");
const miscFunctions = require("./miscFunctions");

const RandomAI = class{
    constructor(width, height) {
        this._possibleGuesses = this.getAllPositions(width, height);
        this._width = width;
        this._height = height;
    }

    /**
     * Generate a random guess given the board state.
     */
    generateGuess(){
        if (this._possibleGuesses.length === 0){
            return null;
        }
        const index = this.getRndInteger(0, this._possibleGuesses.length);
        const guess = this._possibleGuesses[index];
        this._possibleGuesses.splice(index, 1);
        return guess;
    }

    /**
     * Generates an array of all possible positions given board size
     * 
     * @returns {Array[{x: Int, y: Int}]} - Returns an array of all possible positions on the board
     */
    getAllPositions(width, height) {
        let positions = [];
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++){
                positions.push({x: x, y: y});
            }
        }
        return positions;
    }

    /**
     * Helper function to check used coordinates to make sure generated ship is valid
     */
    checkShip(ship, usedCoordinates){
        for(let i = 0; i < ship.length; i++){
            const coord = ship[i];
            if (coord.x >= this._width || coord.y >= this._height){
                return false;
            }
            for(let j = 0; j < usedCoordinates.length; j++){
                if (coord.x === usedCoordinates[j].x && coord.y === usedCoordinates[j].y){
                    return false;
                }
            }
        }
        return true;
    }
    
    /**
     * Generate an array of random ships that follows the basic rules of Battleship.
     * @returns - An array of ShipData objects that is within the boundaries of the board with no overlap.
     */
    getBasicBoardShips() {
        let shipArray = [];
        let usedCoordinates = [];
        let firstTime = true;
        let id = 5;
        for (let i = 2; i < 6; i++) {
            let ship = this.getRandomShip(i, usedCoordinates);
            if (ship === null){
                return null;
            }
            shipArray.push(new ShipData(ship, id--));
            if(i === 3 && firstTime) {
                i--;
                firstTime = false;
            }
        }
        return shipArray;
    }

    /**
     * Generate an array of random ships that follows the basic rules of Battleship.
     * @returns - An array of ShipData objects that is within the boundaries of the board with no overlap.
     */
    getBasicBoardLocations() {
        let shipArray = [];
        let usedCoordinates = [];
        let firstTime = true;
        let id = 5;
        for (let i = 2; i < 6; i++) {
            let ship = this.getRandomShip(i, usedCoordinates);
            if (ship === null){
                return null;
            }
            shipArray.push(ship);
            id--;
            if(i === 3 && firstTime) {
                i--;
                firstTime = false;
            }
        }
        return shipArray;
    }
    

    /**
     * Generate random ship
     */
    getRandomShip(size, usedCoordinates){
        for (let i = 0; i < 20000; i++){
            const index = miscFunctions.getRndInteger(0, this._possibleGuesses.length);
            const start = this._possibleGuesses[index];
            const orientation = miscFunctions.getRndInteger(0, 2);
            let ship = miscFunctions.generateShip(size, start, orientation);
            if (this.checkShip(ship, usedCoordinates)){
                for (let j = 0; j < size; j++){
                    usedCoordinates.push(ship[j]);
                }
                return ship;
            }
        }
        return null;
    }
}

module.exports = RandomAI;