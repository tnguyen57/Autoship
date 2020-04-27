/**
 * A factory/adapter class that will create a ship object
 */
const ShipData = require("./ShipData");
const miscFunctions = require("./miscFunctions");

ShipFactory = class {
    /**
     * Create a ship using an x and y coordinate of the point
     * closest to (0, 0), whether it is horizontal or vertical,
     * and the id. The id determines its size.
     *
     * 1 - Carrier
     * 2 - Battleship
     * 3 - Destroyer
     * 4 - Submarine
     * 5 - Patrol Boat
     *
     * @param {Int} x
     * @param {Int} y
     * @param {boolean} isVertical
     * @param {Int} id
     * @return {ShipData}
     */
    static newBasicShip(x, y, isVertical, id) {
        let size = 0;
        if (id === 1) {
            size = 5;
        } else if (id === 2) {
            size = 4;
        } else if (id === 3) {
            size = 3;
        } else if (id === 4) {
            size = 2;
        }
        let orientation = 0;
        if (isVertical) {
            orientation = 1;
        }
        return new ShipData(
            miscFunctions.generateShip(size, {x: x, y: y}, orientation), id);
    }

    /**
     * Create a ship using an array
     *
     * @param {Array.<{x: Int, y: Int}>} coordinateArray
     * @param {Int} id
     * @return {ShipData}
     */
    static newShip(coordinateArray, id) {
        return new ShipData(coordinateArray, id);
    }
};

module.exports = ShipFactory;
