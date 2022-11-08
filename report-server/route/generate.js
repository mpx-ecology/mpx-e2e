const Router = require('koa-router');
const path = require('path');
const { promises: fs } = require('fs');
const { generateSpec } = require('../gen-spec/gen');
const { getE2erc, genFileMeta } = require('../util');
const fsExtra = require('fs-extra');
const router = new Router({
	prefix: '/gen'
});

router.get('/loadCase', async (ctx, next) => {
	let { jsonName, loadAll } = ctx.query || {};
	// 加载 minitest.json
	const e2erc = getE2erc();
	const { recordsDir,projectPath, jsonCaseCpDir, testSuitsDir } = e2erc;
	try {
		// 不传递 tasks 默认
		let caseDir = path.resolve(projectPath, './minitest');
		let tasks;
		if (+loadAll) {
			tasks = await fs.readdir(caseDir)
		} else {
			await fs.stat(path.join(caseDir, jsonName));
			tasks = [jsonName]
		}

		// 去掉 test.config.json 文件
		tasks = tasks.filter(i => !/^(test\.config)|(testResult)/g.test(i));

		const thePreviewItem = tasks[0]
		const previewTaskPath = path.join(recordsDir, thePreviewItem);
		const minitestJson = require(previewTaskPath);
		const previewFile = genFileMeta(e2erc, thePreviewItem, minitestJson)

		if (!tasks.length) throw new Error(recordsDir + '目录下没有找到 json 文件！请前往模拟器录制 case： 工具 -> 自动化测试 -> 录制');

		if (tasks.length) {
			let result = await generateSpec({ e2erc, file: previewFile });
			ctx.body = {
				errno: 0,
				errmsg: 'ok',
				e2erc,
				tasks,
				preview:result.spec,
				lineNums: result.lineNums,
				minitestJson
			};
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

router.post('/editAndPreviewCase', async (ctx, next) => {
	let e2erc = getE2erc();
	// 不传递 tasks 默认
	const { originJsonData: minitestJson, jsonName, updateMock, insertCode } = ctx.request.body;
	const file = genFileMeta(e2erc, jsonName, minitestJson);
	let result = await generateSpec({ e2erc, file, updateMock, insertCode });
	ctx.body = {
		errno: 0,
		errmsg: 'ok',
		e2erc,
		preview:result.spec,
		lineNums: result.lineNums,
		extraOpsResult: result.extraOpsResult,
		minitestJson
	}
	await next()
});

router.post('/saveSpecAndJson', async (ctx, next) => {
	let e2erc = getE2erc();
	let caseDir = path.resolve(process.cwd(), e2erc.testSuitsDir);
	let jsonCpDir = path.resolve(process.cwd(), e2erc.jsonCaseCpDir);
	const { originJsonData, codeStr, jsonFileName, specFileName } = ctx.request.body;
	ctx.debugg && console.log(path.join(caseDir, specFileName));
	ctx.debugg && console.log(path.join(jsonCpDir, jsonFileName));
	try {
		await fs.writeFile(path.join(caseDir, specFileName), codeStr);
		await fs.writeFile(path.join(jsonCpDir, jsonFileName), JSON.stringify(originJsonData));
		ctx.body = {
			errno: 0,
			errmsg: 'ok',
			data: null
		}
	} catch (e) {
		ctx.body = {
			errno: -1,
			errmsg: 'save json or spec failed',
			data: JSON.stringify(e)
		}
	}

	await next();
})

router.get('/some', async (ctx, next) => {
	ctx.body = {
		errno: 100,
		errMsg: '0K',
		data: {
			ok: 1,
			arr: [10, 12, 14]
		}
	};
	await next();
})

module.exports = router
