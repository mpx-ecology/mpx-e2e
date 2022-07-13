import Router from 'koa-router';
import path from 'path';
import generateSpec from '../gen-spec/gen';

// eslint-disable-next-line no-undef
const cwd = process.cwd();
// eslint-disable-next-line no-undef
let e2erc = require(path.resolve(cwd, './.e2erc.js'))

const router = new Router({
	prefix: '/gen'
});

router.get('/loadCase', async (ctx, next) => {
	// 加载 minitest.json
	let result = await generateSpec(e2erc);
	ctx.body = { e2erc, result };
	return await next();
});

router.get('/', async (ctx, next) => {
	next()
});


export default router
