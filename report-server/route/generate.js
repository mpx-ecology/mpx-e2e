const Router = require('koa-router');
const path = require('path');
const { promises: fs } = require('fs');
const { generateSpec } = require('../gen-spec/gen');
const { getE2erc } = require('../util');
const router = new Router({
	prefix: '/gen'
});

router.get('/loadCase', async (ctx, next) => {
	let { write, preview, jsonName, loadAll } = ctx.query || {};
	// 加载 minitest.json
	try {
		let e2erc = getE2erc();
		// 不传递 tasks 默认
		let caseDir = path.resolve(e2erc.projectPath, './minitest');
		let tasks;
		if (+loadAll) {
			tasks = await fs.readdir(caseDir)
		} else {
			await fs.stat(path.join(caseDir, jsonName));
			tasks = [jsonName]
		}

		// 去掉 test.config.json 文件
		tasks = tasks.filter(i => !/^(test\.config)/g.test(i));

		let previewMode = typeof +preview === 'number' && !isNaN(preview);
		if (tasks.length) {
			let result = await generateSpec({
				e2erc,
				tasks,
				write,
				previewMode
			});
			let res = { errno: 0, errmsg: 'ok', e2erc, tasks };
			if (previewMode) {
				let thePreviewItem = result[tasks[preview]];
				res.preview = thePreviewItem.spec;
				res.originData = thePreviewItem.originData;
			}
			ctx.body = res;
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

router.get('/currentCaseList', async (ctx, next) => {
	console.log(ctx.query.params);
	try {
		let e2erc = getE2erc();
		let list = await fs.readdir(e2erc.testSuitsDir);
		let fileList;
		if (list.length) {
			fileList = list.map(async i => {
				let filePath = path.resolve(e2erc.testSuitsDir, i);
				// let fileContent = await fs.readFile(filePath, 'utf8');
				return {
					name: i,
					filePath,
					// fileContent,
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
});

router.get('/load')

module.exports = router
