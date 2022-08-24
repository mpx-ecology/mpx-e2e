const fs = require('fs');
const path = require('path');
// interface Img {
//   path: string,
//   src: string
// }

// export const imgList: Img[] = []

// export function pushImg (params: Img): void {
//   imgList.push(params)
// }

exports.handleCors = async function handleCors (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
  ctx.set('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
  ctx.set('X-Powered-By', '3.2.1')
  if(ctx.method === 'OPTIONS') {
    ctx.body = '200'
  } else {
    return await next();
  }
}

exports.handleImg = async function handleImg (ctx, next) {
  if (ctx.url.includes('png')) {
    try {
      const file = fs.readFileSync(ctx.url)
      ctx.set('content-type', 'image/png')
      ctx.body = file
    } catch (error) {
      // console.log(error)
    }
  } else {
    return await next()
  }
}

exports.genFileMeta = (e2erc, task, minitestJson) => {
  const taskPath = path.join(e2erc.recordsDir, task);
  return {
    minitestJson: minitestJson ? minitestJson : require(taskPath),
    o: task, // original name of json file
    we: task.replace('.json', ''), // filename  without '.json' extension name
    p: taskPath, // absolute path of json file
    n: path.resolve(process.cwd(), `${e2erc.testSuitsDir}`, task.replace(/\.json/, '')) + '.spec.js' // target spec file full name
  }
};

function getE2erc () {
  const cwd = process.cwd();
  let e2erc = require(path.join(cwd, './.e2erc.js'));
  try {
    ['testSuitsDir', 'recordsDir'].forEach(i => {
      if (!(/^(?:\/|[A-Z]:)/i.test(e2erc[i]))) {
        e2erc[i] = path.resolve(cwd, e2erc[i])
      }
    })
  } catch (error) {
    // e
  }
  return e2erc
}

exports.getE2erc = getE2erc;
