const prettier = require('prettier');
const fsOrigin = require('fs');
const path = require('path');
const tpl = require('./template');
// const fs = fsOrigin.promises;
// const fsExtra = require('fs-extra');
const opType = require('../const/op-type');
/**
 *
 * @param e2erc  .e2erc.js module
 * @param tasks jsonfile[] json file list []
 * @param write <boolean> should write file or not
 * @returns {Promise<*[]>}
 */

function getMockRules (minitestJson, excludeRules) {
  if (!minitestJson || !Array.isArray(minitestJson.commands)) throw new TypeError('json.commands must be an Array');
  let totalMockCount = 0;
  let removedTotalMockCount = 0;
  let replacedApis = 0;
  let replacedFields = 0;

  let rules;
  let extraOpsResult;
  if (excludeRules) {
    rules = []
    let { type, apiName, fieldName, fieldNewValue } = excludeRules
    // for loop other than forEach causing length is mutable!!!!
    // DO NOT cache commands.length
    for (let i = 0; i < minitestJson.commands.length; i++) {
      let c = minitestJson.commands[i];
      let r = c.rule;
      if (c.command !== 'mock' || !Array.isArray(r?.filterList)) continue;
      totalMockCount++;
      switch (type) {
        case 'rmApiRes':
          let aimed = r.filterList.some(itm => new RegExp(apiName, 'img').test(itm.propRegString))
          aimed ? ++removedTotalMockCount && minitestJson.commands.splice(i, 1) && i-- : rules.push(r)
          break;
        case 'replaceApiFields':
          if (r.filterList.some(itm => new RegExp(apiName, 'img').test(itm.propRegString))) {
            replacedApis++;
            const reg = new RegExp(`"(${fieldName})":(?:"([^"]+)"|([^,]+))`, 'img');
            if (r.returnConfig.manual.succ) {
              r.returnConfig.manual.succ.resStr = r.returnConfig.manual.succ.resStr.replace(reg, (w, $1, $2, $3) => {
                replacedFields++;
                return $2
                  ? `"${$1}":"${fieldNewValue}"`
                  : $3
                    ? `"${$1}":${fieldNewValue}`
                    : w
              });
            }
          }
          rules.push(r)
          break
      }
    }
    extraOpsResult = {
      type,
      totalMockCount,
      removedTotalMockCount,
      replacedApis,
      replacedFields,
      leftCount: rules.length
    }
    console.log(`mock 总数：${totalMockCount}, 删除总数 ${removedTotalMockCount}，剩余总数 ${rules.length}`);
  } else {
    rules = minitestJson.commands.filter((i) => i.command === 'mock').map((i) => i.rule);
  }
  return { rules, extraOpsResult: extraOpsResult ? extraOpsResult : null };
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

function calcLineNums(renderStr) {
  let lineNums = {};
  renderStr.split(/\n/m)?.forEach((t, i) => {
    let rank = /【(\d+)】/.exec(t);
    if (rank && rank[1]) {
      lineNums[rank[1]] = i;
    }
  });
  return lineNums
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
    updateMock,
    insertCode,
    e2ercjestTimeout = 30000000
  } = renderCfg;

  // 去重获知被 MOCK 的 api 名称及出现顺序
  let recordAPIs = getMockedApisWithoutDuplicate(minitestJson);

  let { rules: mockRules, extraOpsResult } = getMockRules(minitestJson, updateMock);

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
    insertCode,
    previewMode: false, // previewMode 暂时关闭，编辑器可以承受
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
    cmds,
    extraOpsResult
  }
}

async function generateSpec ({ file, e2erc, updateMock, insertCode }) {
  // 结果集
  let result = {};

  let res = await genSpecString(file.minitestJson, {
    descName: file.we,
    itName: file.we,
    updateMock,
    insertCode,
    ...e2erc,
  })

  let renderStr = res.renderStr;
  result.spec = renderStr;
  result.lineNums = calcLineNums(renderStr);
  result.extraOpsResult = res.extraOpsResult;
  return result
}

module.exports = {
  generateSpec,
  genSpecString,
  getCmds,
  getMockRules,
  cmdToLabel
}
