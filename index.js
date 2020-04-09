const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

router.post("/api/move", ctx => {
    ctx.body = {
        state: Math.random() < 0.5 ? "hit" : "miss"
    };
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3001);
