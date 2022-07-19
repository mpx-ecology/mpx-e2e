const path = require('path');
const utils = require('./utils');
const { promises: fs } = require('fs');
// const NOT_FOUND_TIPS = 'e2e-static-mock-failed! check the json-filename and the static-dir provided!';
// const NOT_FOUND_STATUS = 404;

const e2eMockStatic = (dirname) => {
  return async (ctx, next) => {
    let { request: { url } } = ctx;
    let urlWithoutQueryFirstSlash = utils.urlWithoutQuery(url).slice(1);
    let fileName = utils.toDashJoin(urlWithoutQueryFirstSlash);
    let absDirname = path.resolve(dirname);
    let filePath = path.join(absDirname, `${fileName}.json`)
    try {
      let statObj = await fs.stat(filePath);
      if (statObj.isFile()) {
        ctx.body = await fs.readFile(filePath, 'utf8');
        console.log(`【staticMock】-> ${urlWithoutQueryFirstSlash} matches  ${filePath}`)
      }
    } catch (e) {
    }
    await next()
  }
}

// module.exports = e2eMockStatic

module.exports = e2eMockStatic
