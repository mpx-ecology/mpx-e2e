const Router = require('koa-router');
const path = require('path');
const generateSpec = require('../gen-spec/gen');

const cwd = process.cwd();
const router = new Router({
	prefix: '/gen'
});

router.get('/loadCase', async (ctx, next) => {
	// 加载 minitest.json
	try {
		let e2erc = require(path.resolve(cwd, './.e2erc.js'));
		let result = await generateSpec(e2erc);
		ctx.body = { e2erc, result };
	} catch (e) {
		ctx.body = e;
	}
	return await next();
});

module.exports = router
