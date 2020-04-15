const Koa = require("koa");
const Router = require("@koa/router");
const miscFunctions = require("./server/miscFunctions");
const Game = require("./server/Game");
const RandomAI = require("./server/RandomAI");

const app = new Koa();
const router = new Router();

let activeGames = {};
let gameID = 0;
let noBasicGame = true;

router.post("/api/startBasicGame", ctx => {
    if (noBasicGame){
        activeGames[gameID] = new Game(gameID, 10, 10); 

        ctx.body = {
            gameID: gameID
        }
        noBasicGame = false;
    }
    else{
        ctx.body{
            gameID: gameID;
        }
        gameID++;
        noBasicGame = true;
    }
});

router.post("/api/startBasicGameAI", ctx => {
    activeGames[gameID] = new Game(gameID, 10, 10); 
    
    const BoardAI = new RandomAI();
    activeGames[gameID].addShips(BoardAI.getBasicBoardShips() , false);

    /**
     * TO DO: LAUNCH AI HERE
     */
    gameID++;
});

router.post("/api/placeShips", ctx => {
    /**
     * TO DO
     */


});

router.post("/api/waitShips", ctx => {
    /**
     * TO DO
     */
});



router.post("/api/move", ctx => {
    let currentGame = activeGames[ctx.request.query.id];
    const shipGuess = currentGame.handleGuess(ctx.request.query.x, ctx.request.query.y);

    ctx.body = {
        state: miscFunctions.convertGuess(shipGuess.result),
        ship: shipGuess.id
    };
});

router.post("/api/waitMove", ctx => {
    /**
     * TO DO
     */
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3001);
