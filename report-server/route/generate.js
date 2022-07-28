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
		// 不传递 tasks 默认
		let caseDir = path.resolve(e2erc.projectPath, './minitest');
		let tasks = await fs.readdir(caseDir);
		if (tasks.length) {
			let result = await generateSpec({ e2erc,  tasks, write: true });
			ctx.body = { errno: 0, errmsg: 'ok', e2erc, result };
		} else {
			ctx.body = {
				errno: 100,
				errmsg: 'no json file',
				e2erc,
				result: null
			}
		}
		console.log('gen case done!');
	} catch (e) {
		console.log(e);
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
