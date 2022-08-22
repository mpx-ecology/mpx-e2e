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

function getValueByPath (object, prop) {
  prop = prop || '';
  // paths => [xxx, xxx, xxx]
  // object: {
  //   xxx: {
  //     xxx: {
  //       xxx: 'xxx'
  //     }
  //   }
  // }
  const paths = prop.split(/\.|\[/g).map(i => i.replace(/\]/g, ''));
  // 把对象保存起来，以免改变了原有对象
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    // 当到达指定的属性名时，返回它的属性值
    if (i === j - 1) {
      result = current[path];
      break;
    }
    // 否则继续往下遍历
    current = current[path];
  }
  return result;
};

let obj = {
  result: {
    errno: 0,
    data: {
      car_list: [
        {
          brand_name: {
            x: [
              {
                some: [
                  {
                    attr: [
                      {
                        a: 100,
                        b: 200
                      },
                      {
                        a: 300,
                        b: 400
                      },
                      {
                        a: 500,
                        b: 600
                      },
                      {
                        a: 700,
                        b: 800
                      }
                    ]
                  }
                ]
              }
            ]
          },
          brand_desc: 'hahahha'
        }
        ]
    } }
};

console.log(getValueByPath(obj, 'result.data.car_list[0].brand_name.x[0].some[0].attr[4].a'))

exports.getE2erc = getE2erc;
