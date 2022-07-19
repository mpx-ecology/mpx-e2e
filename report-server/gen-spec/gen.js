const prettier = require('prettier');
const fsOrigin = require('fs');
const path = require('path');
const tpl = require('./template');
const fs = fsOrigin.promises;

exports.generateSpec = async function generateSpec (e2eRc) {
  const { testSuitsDir,projectPath } = e2eRc;

  if (!testSuitsDir) throw new Error('.e2erc.js.testSuitsDir which means spec file directory is not defined! please configure it !');

  let caseDir = path.resolve(projectPath, './minitest');
  //
  let miniTestList = await fs.readdir(caseDir);
  let files = miniTestList.map((i) => {
    return {
      o: i,
      we: i.replace('.json', ''),
      p: path.join(caseDir, i),
      n: path.resolve(process.cwd(), `${testSuitsDir}`, i.replace(/\.json/, '')) + '.spec.js'
    }
  });

  let specFileList = [];

  if (!files.length) throw new Error(caseDir + '目录下没有找到 json 文件！请前往模拟器录制 case： 工具 -> 自动化测试 -> 录制');
  for (let f of files) {
    let minitestJson = require(f.p);

    let mockRules = minitestJson.commands
      .filter((i) => i.command === 'mock')
      .map((i) => i.rule);

    let cmds = minitestJson.commands.filter((i) => !['mock', 'startRecord', 'stopRecord'].includes(i.command));

    // 把文字中的换行符等过滤掉，防止意外换行导致格式化失败
    cmds = cmds.map((i) => /\n|\t|\r\n/g.test(i.text) ? { ...i, text: i.text.replace(/\n|\t|\r\n/g, ' ') } : i);

    let c = cmds;

    let rd = {
      projectPath,
      blockPath: path.resolve(__dirname, './blocks'),
      descName: f.we,
      itName: f.we,
      needRealMachine: false, // 是否需要真机
      jestTimeout: 30000000,
      defaultWaitFor: 10000, // 默认 waitFor 等待时长
      connectUrl: 'ws://localhost:9420', // wsEndPoint
      mockRules: mockRules?.length ? mockRules : false,
      cmds: c,
      macroPath: './macros',
      item: c[0],
      connectFirst: false, // automator 优先使用 connect 而非 launch
    };

    let tplPath = path.resolve(__dirname, './tpl.njk')
    // let str = await fs.readFile(tplPath, 'utf-8');
    // console.log(str);
    // let res = nunjucks.renderString(str, rd);

    let res = tpl(rd);
    res = await prettier.format(res, { semi: true, singleQuote: true, parser: 'babel' });
    await fs.writeFile(f.n, res);
    specFileList.push(res);
  }
  return specFileList
}
