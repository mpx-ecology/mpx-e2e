const Router = require('koa-router');
const path = require('path');
const { promises: fs } = require('fs');
const generateSpec = require('../gen-spec/gen');
const { getE2erc } = require('../util');
const router = new Router({
	prefix: '/gen'
});

router.get('/loadCase', async (ctx, next) => {
	// 加载 minitest.json
	try {
		let e2erc = getE2erc();
		let result = await generateSpec(e2erc);
		console.log(result);
		ctx.body = { e2erc, result };
	} catch (e) {
		ctx.body = e;
	}
	return await next();
});

router.get('/caseList', async (ctx, next) => {
	try {
		let e2erc = getE2erc();
		let list = await fs.readdir(e2erc.testSuitsDir);
		let fileList;
		if (list.length) {
			fileList = list.map(async i => {
				let filePath = path.resolve(e2erc.testSuitsDir, i);
				let fileContent = await fs.readFile(filePath, 'utf8');
				return {
					name: i,
					filePath,
					fileContent,
				}
			})
		}

		let r = await Promise.all(fileList)
		ctx.body = {
			errno: 0,
			errmsg: 'ok',
			data: { fileList: r }
		}
		list = fileList = e2erc = null;
	} catch (e) {
		console.error(e);
		ctx.body = {
			errno: 100,
			errmsg: 'get case list faile',
			err: e.toString()
		}
	}
	return await next();
})

module.exports = router
