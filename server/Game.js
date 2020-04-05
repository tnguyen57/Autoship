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
     */
    constructor(shipArray1, shipArray2){
        this._board1 = new BoardData(shipArray1);
        this._board2 = new BoardData(shipArray2);
        this._firstPlayer = True; //Contains the 
    }

    /**
     * Handle guesses
     * 
     * @param {Int} x - x coordinate of guess
     * @param {Int} y - y coordinate of guess
     * @modify - Set it to the second players turn
     * @return {{firstPlayer:Boolean: , status:Guesses}} - Return an tuple containing the player and status. Player is true if first player. 
     */
    handleGuess(x, y){
        firstPlayer = this._firstPlayer;
        this._firstPlayer = !(this._firstPlayer); //Swapping to next turn
        if (firstPlayer){
            return {firstPlayer: firstPlayer, status:this._board1.guess(x, y)};
        }
        return {firstPlayer: firstPlayer, status:this._board2.guess(x, y)};
    }
    
    /**
     * Check if it is the first player's turn.
     * 
     * @return {Boolean} - returns true if first player's turn
     */
    get isPlayerOne(){
        return this._firstPlayer;
    }
}