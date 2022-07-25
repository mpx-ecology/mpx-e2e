const prettier = require('prettier');
const fsOrigin = require('fs');
const path = require('path');
const tpl = require('./template');
const fs = fsOrigin.promises;
const fsExtra = require('fs-extra');
/**
 *
 * @param e2erc  .e2erc.js module
 * @param tasks jsonfile[] json file list []
 * @param write <boolean> should write file or not
 * @returns {Promise<*[]>}
 */
module.exports = async function generateSpec ({ e2erc, tasks, write = false }) {
  const { recordsDir, testSuitsDir,projectPath, jsonCaseCpDir } = e2erc;

  if (!testSuitsDir) throw new Error('.e2erc.js.testSuitsDir which means spec file directory is not defined! please configure it !');

  let files = tasks.map((i) => {
    return {
      o: i, // original name of json file
      we: i.replace('.json', ''), // filename  without '.json' extension name
      p: path.join(recordsDir, i), // absolute path of json file
      n: path.resolve(process.cwd(), `${testSuitsDir}`, i.replace(/\.json/, '')) + '.spec.js' // target spec file full name
    }
  });

  let specFileList = [];

  if (!files.length) throw new Error(recordsDir + '目录下没有找到 json 文件！请前往模拟器录制 case： 工具 -> 自动化测试 -> 录制');
  for (let f of files) {
    // 文件冲突检查 & 复制文件
    // 复制 minitest/*.json 到 e2erc.jsonCaseCpDir
    if (jsonCaseCpDir) await fsExtra.copy(f.p, `${jsonCaseCpDir}/${f.o}`);

    let minitestJson = require(f.p);

    // 去重获知被 MOCK 的 api 名称及出现顺序
    let recordsAPIs = minitestJson?.env?.recordAPIs.length ? [...new Set(minitestJson.recordAPIs)] : [];

    let mockRules = minitestJson.commands
      .filter((i) => i.command === 'mock')
      .map((i) => i.rule);

    let cmds = minitestJson.commands.filter(i => !['mock', 'startRecord', 'stopRecord'].includes(i.command));

    // 把文字中的换行符等过滤掉，防止意外换行导致格式化失败
    cmds = cmds.map((i) => /\n|\t|\r\n/g.test(i.text) ? { ...i, text: i.text.replace(/\n|\t|\r\n/g, ' ') } : i);

    let c = cmds;

    let rd = {
      recordsAPIs, // minitest.json 中记录的被 mock 的 api
      projectPath,
      // blockPath: path.resolve(__dirname, './blocks'),
      descName: f.we,
      itName: f.we,
      needRealMachine: e2erc.needRealMachine || false, // 是否需要真机
      jestTimeout: e2erc.jestTimeout || 30000000,
      defaultWaitFor: e2erc.defaultWaitFor || 10000, // 默认 waitFor 等待时长
      wsEndpoint: e2erc.wsEndpoint, // wsEndPoint
      cmds: c,
      // macroPath: './macros',
      item: c[0],
      connectFirst: e2erc.connectFirst, // automator 优先使用 connect 而非 launch
    };

    if (recordsAPIs.length) {
      recordsAPIs.forEach(i => {
        rd[`${i}MockRules`] = mockRules.filter(r => r.ruleName === i)
      })
    }

    console.log(rd);

    let res = tpl(rd);
    res = await prettier.format(res, { semi: true, singleQuote: true, parser: 'babel' });
    if (write) {
      await fs.writeFile(f.n, res);
    }
    specFileList.push(res);
  }
  return specFileList
}
