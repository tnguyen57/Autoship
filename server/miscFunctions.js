const Guesses = require("./utilities");
const fs = require("fs");

const miscFunctions = class {
    /**
     * Create an array of coordinates corresponding to a ship.
     * @param {Int} size - The size of the ship
     * @param {{x: Int, y: Int}} start - The coordinate of the top-left
     *                                   position of the ship
     * @param {Int} orientation - An integer. 1 means it's vertical.
     *                            Anything else is horizontal.
     * @return {Array<{x: Int, y: Int}>}
     */
    static generateShip(size, start, orientation) {
        const ship = [];
        for (let i = 0; i < size; i++) {
            if (orientation === 1) {
                ship.push({x: start.x, y: start.y + i});
            } else {
                ship.push({x: start.x + i, y: start.y});
            }
        }
        return ship;
    }

    /**
     * Generates and return a random integer between
     * min (inclusive and max (exlucisve)
     *
     * @param {Int} min - The lower inclusive bound of the
     *                     random integer generator
     * @param {Int} max - The upper exclusive bound of the
     *                     random integer generator
     * @return {Int} - The randomly generated integer between
     *                     min (inclusive) and max (exclusive)
     */
    static getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    /**
     * Create a string using a Guess parameter
     *
     * @param {Guesses} result - The Guess to be converted
     * @return {String} - The string result
     */
    static convertGuess(result) {
        const classification = result.result;
        if (classification === Guesses.HIT) {
            return "hit";
        } else if (classification === Guesses.MISS) {
            return "miss";
        } else if (classification === Guesses.SINK) {
            return "hit";
        } else {
            return "error";
        }
    }

    /**
     * Write a ship array to a file to be processed by the AI.
     *
     * Requires. Being in the main directory.
     * @param {Int} id
     * @param {Array.<{x: Int, y: Int}>} shipData
     * @param {Int} width
     * @param {Int} height
     */
    static writeShipArrayToFile(id, shipData, width, height) {
        const filename = "./AI/Board" + id.toString() + ".txt";

        fs.writeFileSync(filename, width.toString() + " " +
          height.toString() + "\n", function(err) {
            if (err) throw err;
        });

        fs.appendFileSync(filename, shipData.length.toString() +
          "\n", function(err) {
            if (err) throw err;
        });

        for (let i = 0; i < shipData.length; i++) {
            const ship = shipData[i];
            fs.appendFileSync(filename, ship.length.toString()+ " ",
                function(err) {
                    if (err) throw err;
                });

            for (let j = 0; j < ship.length; j++) {
                fs.appendFileSync(filename, ship[j].x + " " +
                  ship[j].y + " ", function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFileSync(filename, "\n", function(err) {
                if (err) throw err;
            });
        }


        fs.appendFileSync(filename, "end", function(err) {
            if (err) throw err;
        });
    }
};

module.exports = miscFunctions;
