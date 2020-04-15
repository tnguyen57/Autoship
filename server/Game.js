/**
 * This class will simulate a game of Battleship.
 * This class will store the board and player data.
 * 
 * 
 */
const BoardData = require("./BoardData");
const Guesses = require("./utilities");

let Game = class {
    /**
     * Construct a Basic Game using two ship arrays
     * @param {Array[ShipData]} shipArray1 
     * @param {Array[ShipData]} shipArray2 
     * @param {Int} width;
     * @param {Int} height;
     */
    constructor(id = 0, width = 10, height = 10){
        this._board1 = null;
        this._board2 = null;
        this._firstPlayer = true; //Contains the 
        this._id = id;
        this._width = width;
        this._height = height;
    }

    addShips(shipArray, playerOne){
        if (playerOne){
            this._board1 = new BoardData(shipArray, this._width, this._height);
        }
        else{
            this._board2 = new BoardData(shipArray, this._width, this._height);
        }
    }

    /**
     * Handle guesses
     * 
     * @param {Int} x - x coordinate of guess
     * @param {Int} y - y coordinate of guess
     * @modify - Set it to the second players turn
     * @return {id: Int, result: Guesses} - Returns whether the guess is a hit/miss/sink and the id of the ship if hit/sink - Return an tuple containing the player and status. Player is true if first player. 
     */
    handleGuess(x, y){
        const firstPlayer = this._firstPlayer;
        this._firstPlayer = !(this._firstPlayer); //Swapping to next turn
        if (firstPlayer){
            return this._board2.guess(x, y);
        }
        return this._board1.guess(x, y);
    }
    
    /**
     * Check if it is the first player's turn.
     * 
     * @return {Boolean} - returns true if first player's turn
     */
    get isPlayerOne(){
        return this._firstPlayer;
    }

    /**
     * Returns the id for the game
     * 
     * @return {Int} - returns the game ID
     */
    get id(){
        return this._id;
    }

    /**
     * Returns the size of the board
     * 
     * @return {{width: Int, height: Int}} - returns the game ID
     */
    get size(){
        return {width: this._width, height: this._height};
    }

    /**
     * Returns if the game is finished.
     * 
     * @return {Boolean} - returns true if the game is complete
     */
    get isFinish(){
        return (this._board1.shipCount === 0 || this._board2.shipCount === 0);
    }
}

module.exports = Game;
