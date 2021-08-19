import * as path from 'path';
import * as utils from './utils';
import { promises as fs }  from 'fs';
import Application from 'koa';

const NOT_FOUND_TIPS = 'e2e-static-mock-failed! check the json-filename and the static-dir provided!';
const NOT_FOUND_STATUS = 404;
const e2eMockStatic = (dirname:string) => {
  return async (ctx: Application.DefaultContext, next:Function) => {
    let { request: { url } } = ctx;
    let urlWithoutQueryFirstSlash:string = utils.urlWithoutQuery(url).slice(1);
    let fileName:string = utils.toDashJoin(urlWithoutQueryFirstSlash);
    let absDirname:string = path.resolve(dirname);
    let statObj = await fs.stat(absDirname);
    let filePath = ''
    if (statObj.isDirectory()) {
      filePath = path.join(absDirname, `${fileName}.json`)
      console.log('filePath', `${fileName}.json`)
    }
    try {
      ctx.body = await fs.readFile(filePath, 'utf8');
    } catch (e) {
      ctx.status = NOT_FOUND_STATUS;
      ctx.body = NOT_FOUND_TIPS;
    }
    next()
  }
}

module.exports = e2eMockStatic
