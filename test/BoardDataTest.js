var assert = require('assert');
var ShipData = require("../server/ShipData");
var Guesses = require("../server/utilities");
var BoardData = require("../server/BoardData");


describe('BoardData', function() {
    describe('#constructor', function() {
        it('should be able to construct BoardData from a array of ships', function() {
          a = [{x: 1, y: 2}, {x: 2, y: 2}];
          b = [{x: 5, y: 6}, {x: 6, y: 6}];
          let Board = new BoardData([new ShipData(a, 1), new ShipData(b, 2)]);
          assert.equal(Board.shipCount, 2);
          assert.equal(Board.width, 10);
          assert.equal(Board.height, 10);
        }),
        it('should be able to classify empty ships as sunk', function() {
            a = [{x: 1, y: 2}, {x: 2, y: 2}];
            b = []; 
            let Board = new BoardData([new ShipData(a, 1), new ShipData(b, 2)]);
            
            assert.equal(Board.shipCount, 1);
            assert.equal(Board.lastSunkID, 2);
        });
    }),

    describe('#guesses', function() {
        it('should be able to return "miss" when the guess misses', function() {
            a = [{x: 1, y: 2}, {x: 2, y: 2}];
            b = [{x: 5, y: 6}, {x: 6, y: 6}];
            let Board = new BoardData([new ShipData(a, 1), new ShipData(b, 2)]);
            assert(Board.guess(0, 0) === Guesses.MISS);
        }),
        it('should be able to return "hit" when the guess succeed', function() {
            a = [{x: 1, y: 2}, {x: 2, y: 2}];
            b = [{x: 5, y: 6}, {x: 6, y: 6}];
            let Board = new BoardData([new ShipData(a, 1), new ShipData(b, 2)]);
            assert(Board.guess(5, 6) === Guesses.HIT);
        }),
        it('should be able to return "sink" when the guess succeed', function() {
            a = [{x: 1, y: 2}, {x: 2, y: 2}];
            b = [{x: 5, y: 6}, {x: 6, y: 6}];
            let Board = new BoardData([new ShipData(a, 1), new ShipData(b, 2)]);
            assert(Board.guess(5, 6) === Guesses.HIT);
            assert(Board.guess(6, 6) === Guesses.SINK);
            assert(Board.lastSunkID === 2);
            assert(Board.shipCount === 1);
          });
      });
});