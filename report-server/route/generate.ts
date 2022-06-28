import Router from 'koa-router';
import * as Application from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import generateSpec from '../gen-spec/gen';

const cwd = process.cwd();
let e2erc = require(path.resolve(cwd, './.e2erc.js'))


const router = new Router({
	prefix: '/gen'
});

router.get('/loadCase', async (ctx:Application.Context) => {
	// 加载
	let result = await generateSpec(e2erc);
	ctx.body = { e2erc, result };
})

export default router
