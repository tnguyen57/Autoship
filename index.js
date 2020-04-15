const Koa = require("koa");
const Router = require("@koa/router");
const miscFunctions = require("./server/miscFunctions");

const app = new Koa();
const router = new Router();

let activeGames = {};
let gameID = 0;

router.post("/api/startAI", ctx => {

    gameID++;
});



router.post("/api/move", ctx => {
    let game = activeGames[ctx.request.query.id];
    const result = game.handleGuess(ctx.request.query.x, ctx.request.query.y);

    ctx.body = {
        state: miscFunctions.convertGuess(result.status),
    };
});

app
    .use(router.routes())
    .use(router.allowedMethods());

/**
 * Start a game against an AI
 * @param {*} ctx 
 * @param {*} next 
 */
async function startGameAI(ctx, next) {
  // parse client request using ctx
  await next();
  // build response using ctx
}

/**
 * Start a game against another person
 * @param {*} ctx 
 * @param {*} next 
 */
async function startGame(ctx, next) {
  // parse client request using ctx
  await next();
  // build response using ctx
}


/**
 * Start a game against an AI
 * @param {*} ctx 
 * @param {*} next 
 */
async function startGameAI(ctx, next) {
  // parse client request using ctx
  await next();
  // build response using ctx
}

/**
 * Handles the guess for player one
 * @param {*} ctx 
 * @param {*} next 
 */
async function handleGuess1(ctx, next) {
  // parse client request using ctx
  await next();
  // build response using ctx
}

/**
 * Handles the guess for player two
 * @param {*} ctx 
 * @param {*} next 
 */
async function handleGuess2(ctx, next) {
  // parse client request using ctx
  await next();
  // build response using ctx
}




app.listen(3001);
