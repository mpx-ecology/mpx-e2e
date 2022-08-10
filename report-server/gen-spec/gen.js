const prettier = require('prettier');
const fsOrigin = require('fs');
const path = require('path');
const tpl = require('./template');
const fs = fsOrigin.promises;
const fsExtra = require('fs-extra');
const opType = require('../const/op-type');
/**
 *
 * @param e2erc  .e2erc.js module
 * @param tasks jsonfile[] json file list []
 * @param write <boolean> should write file or not
 * @returns {Promise<*[]>}
 */
let i = 0;

function getMockRules (minitestJson) {
  if (!minitestJson || !Array.isArray(minitestJson.commands)) throw new TypeError('json.commands must be an Array');
  return minitestJson.commands.filter((i) => i.command === 'mock').map((i) => i.rule);
}

function getCmds (minitestJson, excludeRules = []) {
  if (!minitestJson || !Array.isArray(minitestJson.commands)) throw new TypeError('json.commands must be an Array');
  return minitestJson.commands.filter(i => !['mock', 'startRecord', 'stopRecord', ...excludeRules].includes(i.command));
}

function getMockedApisWithoutDuplicate (minitestJson) {
  return minitestJson?.env?.recordAPIs.length ? [...new Set(minitestJson.env.recordAPIs)] : [];
}

function cmdToLabel (cmds) {
  return cmds.map(i => {
    let { command } = i;
    let res = {
      cmd: command,
    }
    let fun = opType[command];
    switch (command) {
      case 'tap':
        res.label = fun('标签名：' + i.tagName + ', target xpath ' + i.target)
        break;
      case 'assertVisible':
        res.label = fun(i.target)
        break;
      case 'dataSnapshot':
        res.label = fun();
        break;
      case 'wxmlSnapshot':
        res.label = fun();
        break;
      case 'assertTextContent':
        res.label = fun();
        break;
      case 'assertTextLength':
        res.label = fun();
        break;
      case 'assertTextByRegExp':
        res.label = fun();
        break;
      case 'assertElementWidth':
        res.label = fun();
        break;
      case 'assertElementLength':
        res.label = fun();
        break;
      case 'assertResponseContent':
        res.label = fun();
        break;
      case 'waitForSomeTime':
        res.label = fun();
        break;
      case 'waitForExactRouter':
        res.label = fun();
        break;
      case 'waitForApiResponse':
        res.label = fun();
        break;
      case 'operateRouterRelaunch':
        res.label = fun();
        break;
      case 'operateRouterBack':
        res.label = fun();
        break;
      case 'operateRouterSwitchTab':
        res.label = fun();
    }
    return res
  })
}

async function genSpecString (minitestJson, renderCfg) {

  const {
    projectPath,
    wsEndpoint,
    defaultWaitFor = 6000,
    needRealMachine = false,
    connectFirst,
    descName, // spec.js
    itName,
    previewMode,
    e2ercjestTimeout = 30000000
  } = renderCfg;

  // 去重获知被 MOCK 的 api 名称及出现顺序
  let recordAPIs = getMockedApisWithoutDuplicate(minitestJson);

  let mockRules = getMockRules(minitestJson);

  let cmds = getCmds(minitestJson);

  // 把文字中的换行符等过滤掉，防止意外换行导致格式化失败
  cmds = cmds.map((i) => /\n|\t|\r\n/g.test(i.text) ? { ...i, text: i.text.replace(/\n|\t|\r\n/g, ' ') } : i);

  let types = cmds.map(i => i.command);

  let renderData = {
    recordAPIs, // minitest.json 中记录的被 mock 的 api
    projectPath,
    descName, // spec.js
    itName,
    needRealMachine, // 是否需要真机
    jestTimeout: e2ercjestTimeout,
    defaultWaitFor, // 默认 waitFor 等待时长
    wsEndpoint, // wsEndPoint
    cmds,
    previewMode,
    connectFirst, // automator 优先使用 connect 而非 launch
  };

  if (recordAPIs.length) {
    // 把各个被 mock 的 api 对应的 rule 拍平到 renderData 下
    recordAPIs.forEach(i => {
      renderData[`${i}MockRules`] = mockRules.filter(r => r.apiName === i)
    })
  }

  let renderStr = await prettier.format(tpl(renderData), { semi: true, singleQuote: true, parser: 'babel' });

  return {
    renderStr,
    recordAPIs,
    cmds
  }
}

async function generateSpec ({ previewMode, e2erc, tasks, write = false }) {
  const {
    recordsDir,
    testSuitsDir,
    projectPath,
    jsonCaseCpDir,
    wsEndpoint,
    defaultWaitFor = 6000,
    needRealMachine = false,
    e2ercjestTimeout = 30000000
  } = e2erc;

  if (!testSuitsDir) throw new Error('.e2erc.js.testSuitsDir which means spec file directory is not defined! please configure it !');

  let files = tasks.map((i) => {
    return {
      o: i, // original name of json file
      we: i.replace('.json', ''), // filename  without '.json' extension name
      p: path.join(recordsDir, i), // absolute path of json file
      n: path.resolve(process.cwd(), `${testSuitsDir}`, i.replace(/\.json/, '')) + '.spec.js' // target spec file full name
    }
  });

  // 结果集
  let result = {};

  if (!files.length) throw new Error(recordsDir + '目录下没有找到 json 文件！请前往模拟器录制 case： 工具 -> 自动化测试 -> 录制');
  for (let f of files) {
    result[f.o] = {};
    // 文件冲突检查 & 复制文件
    // 复制 minitest/*.json 到 e2erc.jsonCaseCpDir
    if (jsonCaseCpDir) await fsExtra.copy(f.p, `${jsonCaseCpDir}/${f.o}`);

    let minitestJson = require(f.p);

    result[f.o].originData = minitestJson;

    let res = await genSpecString(minitestJson, {
      previewMode,
      descName: f.we,
      itName: f.we,
      ...e2erc,
    })

    if (write) {
      await fs.writeFile(f.n, res.renderStr);
    }
    result[f.o].spec = res.renderStr;
  }
  return result
}

module.exports = {
  generateSpec,
  genSpecString,
  getCmds,
  getMockRules,
  cmdToLabel
}
