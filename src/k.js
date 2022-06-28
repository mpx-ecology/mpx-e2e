let Koa = require('koa');
let KoaRouter = require('koa-router');
let { promises: fs } = require('fs');

let app = new Koa();
let router = new KoaRouter();


router.get('/loadCase', async (ctx, next) => {
  let r = await fs.readdir('./e2e-mock')
  ctx.boyd = { r };
})

app.use(router.routes());


app.listen(8886)
