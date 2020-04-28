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
     * @param {Int} size
     * @return {ShipData}
     */
    static newBasicShip(x, y, isVertical, id, size) {
        let orientation = 0;
        if (isVertical) {
            orientation = 1;
        }
        let v = miscFunctions.generateShip(size, {x: x, y: y}, orientation);
        console.log(v);
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
