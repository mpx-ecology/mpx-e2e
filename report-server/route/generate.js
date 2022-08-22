const Router = require('koa-router');
const path = require('path');
const { promises: fs } = require('fs');
const { generateSpec } = require('../gen-spec/gen');
const { getE2erc, genFileMeta } = require('../util');
const fsExtra = require('fs-extra')
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
		tasks = tasks.filter(i => !/^(test\.config)/g.test(i));

		// let files = tasks.map((i) => {
		// 	let p = path.join(recordsDir, i);
		// 	return {
		// 		minitestJson: require(p),
		// 		o: i, // original name of json file
		// 		we: i.replace('.json', ''), // filename  without '.json' extension name
		// 		p, // absolute path of json file
		// 		n: path.resolve(process.cwd(), `${testSuitsDir}`, i.replace(/\.json/, '')) + '.spec.js' // target spec file full name
		// 	}
		// });

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
	let caseDir = path.resolve(e2erc.projectPath, './minitest');
	const { originJsonData: minitestJson, jsonName } = ctx.request.body;
	const file = genFileMeta(e2erc, jsonName, minitestJson);
	let result = await generateSpec({ e2erc, file });
	ctx.body = {
		errno: 0,
		errmsg: 'ok',
		e2erc,
		preview:result.spec,
		lineNums: result.lineNums,
		minitestJson
	}
	await next()
})

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
