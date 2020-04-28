const Koa = require("koa");
const Router = require("@koa/router");
const koaBody = require("koa-body");
const miscFunctions = require("./server/miscFunctions");
const Game = require("./server/Game");
const RandomAI = require("./server/RandomAI");
const ShipFactory = require("./server/ShipFactory");
const AIRunner = require("./server/AIRunner");

const app = new Koa();
const router = new Router();

let activeGames = {};
let gameID = 0;
let noBasicGame = true;
const BoardAI = new RandomAI(10, 10);

let Game0 = new Game(0, 10, 10);
Game0.addShips(BoardAI.getBasicBoardShips() , true);
Game0.addShips(BoardAI.getBasicBoardShips() , false);

router.post("/api/startBasicGame", ctx => {
    if (noBasicGame){
        activeGames[gameID] = new Game(gameID, 10, 10); 

        ctx.body = {
            gameID: gameID
        }
        noBasicGame = false;
    }
    else{
        ctx.body = {
            gameID: gameID
        };
        gameID++;
        noBasicGame = true;
    }
});


router.post('/api/move', koaBody(),
  (ctx) => {
    console.log(ctx.request.body);
    // => POST body
    ctx.body = JSON.stringify(ctx.request.body);
    const x = ctx.request.body.x;
    const y = ctx.request.body.y;
    //Players Guess
    let guess1 = miscFunctions.convertGuess(Game0.handleGuess(x, y));
    console.log(guess1);
    //Player 2/AI guess
    let guess2 = miscFunctions.convertGuess(Game0.handleGuess(x, y));
    ctx.response.body = {state: guess1};
  }
);

router.post("/api/startBasicGameAI", ctx => {
    activeGames[gameID] = new Game(gameID, 10, 10); 
    
    const BoardAI = new RandomAI();
    activeGames[gameID].addShips(BoardAI.getBasicBoardShips() , false);
    gameID++;
});

router.post("/api/placeShips", koaBody(), 
(ctx) => {
    
    let shipArray = [];
    console.log(ctx.request.body);
    let i = 0;
    while (i < 5){
        let data = ctx.request.body[i];
        let orientation = 0;
        if (data.rotation === "vertical"){
            orientation = 1;
        }
        let size = parseInt(data.length);
        let x = parseInt(data.x);
        let y = parseInt(data.y);

        shipArray.push(miscFunctions.generateShip(size, {x: x, y: y}, orientation));
        i++;
    }
    miscFunctions.writeShipArrayToFile(0, shipArray, 10, 10);
 

    const AI = new AIRunner(0, 2);
    AI.startAI();
    
});

router.post("/api/waitShips", ctx => {
    /**
     * TO DO
     */
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
