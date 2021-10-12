import * as path from 'path';
import * as utils from './utils';
import { promises as fs }  from 'fs';
import Application from 'koa';

// const NOT_FOUND_TIPS = 'e2e-static-mock-failed! check the json-filename and the static-dir provided!';
// const NOT_FOUND_STATUS = 404;

const e2eMockStatic = (dirname:string) => {
  return async (ctx: Application.DefaultContext, next:Function) => {
    let { request: { url } } = ctx;
    let urlWithoutQueryFirstSlash:string = utils.urlWithoutQuery(url).slice(1);
    let fileName:string = utils.toDashJoin(urlWithoutQueryFirstSlash);
    let absDirname:string = path.resolve(dirname);
    let filePath = path.join(absDirname, `${fileName}.json`)
    try {
      let statObj = await fs.stat(filePath);
      if (statObj.isFile()) {
        ctx.body = await fs.readFile(filePath, 'utf8');
        console.log(`【staticMock】-> ${urlWithoutQueryFirstSlash} matches  ${filePath}`)
      }
    } catch (e) {
      // ctx.status = NOT_FOUND_STATUS;
      // ctx.body = NOT_FOUND_TIPS;
      // console.log(`${url} does not match any file, will be transfer to its origin host!`)
    }
    await next()
  }
}

// module.exports = e2eMockStatic

export default e2eMockStatic
