var assert = require('assert');
var ShipData = require("../server/ShipData");
var Guesses = require("../server/utilities");


describe('ShipData', function() {
  describe('#constructor', function() {
    it('should be able to construct ShipData from a list of coordinates', function() {
      a = [{x: 1, y: 2}, {x: 2, y: 2}];
      let ship = new ShipData(a);
    }),
    it('should be able to construct from an empty array', function() {
        a = [];
        let ship = new ShipData(a);
        assert(ship.isSunk());
      });
  }),

  describe('#guesses', function() {
    it('should be able to return "miss" when the guess misses', function() {
      a = [{x: 1, y: 2}, {x: 2, y: 2}];
      let ship = new ShipData(a);
      assert(ship.guess(0, 0) === Guesses.MISS);
    }),
    it('should be able to return "hit" when the guess succeed', function() {
        a = [{x: 1, y: 2}, {x: 2, y: 2}];
        let ship = new ShipData(a);
        assert(ship.guess(1, 2) === Guesses.HIT);
    }),
    it('should remove the coordinate from ship when "hit" ', function() {
        a = [{x: 1, y: 2}, {x: 2, y: 2}];
        let ship = new ShipData(a);
        assert(ship.guess(1, 2) === Guesses.HIT);
        assert(ship.guess(1, 2) === Guesses.MISS);
    }),
    it('should be able to return "sink" when the guess succeed', function() {
        a = [{x: 1, y: 2}, {x: 2, y: 2}];
        let ship = new ShipData(a);
        assert(ship.guess(1, 2) === Guesses.HIT);
        assert(ship.guess(2, 2) === Guesses.SINK);
        assert(ship.isSunk);
      });
  });
});



