var assert = require('assert');
var ShipData = require("../server/ShipData");
var Guesses = require("../server/utilities");
var BoardData = require("../server/BoardData");
var Game = require("../server/Game");


describe('Game', function() {
    describe('#constructor', function() {
        it('should be able to construct Game from two array of ships', function() {
          a = [{x: 1, y: 2}, {x: 2, y: 2}];
          b = [{x: 5, y: 6}, {x: 6, y: 6}];
          let Game0 = new Game([new ShipData(a, 1)], [new ShipData(b, 1)]);
          assert.equal(Game0.id, 0);
          assert.equal(Game0.size.width, 10);
          assert.equal(Game0.size.height, 10);
        });
        it('should be able to hava a unique ID for the game', function() {
            a = [{x: 1, y: 2}, {x: 2, y: 2}];
            b = [{x: 5, y: 6}, {x: 6, y: 6}];
            let Game1 = new Game([new ShipData(a, 1)], [new ShipData(b, 1)], 7, 8);
            assert.equal(Game1.id, 1);
            assert.equal(Game1.size.width, 7);
            assert.equal(Game1.size.height, 8);
          });
    });

    describe('#handleGuess', function() {
        it('should be able to handle guesses/ while alternating turns', function() {
            a = [{x: 5, y: 6}, {x: 6, y: 6}];
            b = [{x: 1, y: 2}, {x: 2, y: 2}];
            let Game2 = new Game([new ShipData(a, 1)], [new ShipData(b, 1)]);
            assert.equal(Game2.id, 2);
            assert.equal(Game2.handleGuess(1, 2).status, Guesses.HIT);
            assert.equal(Game2.handleGuess(5, 6).status, Guesses.HIT);
            assert.equal(Game2.handleGuess(1, 1).status, Guesses.MISS);
            assert.equal(Game2.handleGuess(6, 6).status, Guesses.SINK);
            assert.equal(Game2.lastSunkID, 1)
            assert(Game2.isFinish);
        });
    });


});
