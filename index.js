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

app.listen(3001);
