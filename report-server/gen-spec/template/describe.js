let mock = require('./mock');
let beforeAll = require('./beforeAll');
let afterAll = require('./afterAll');
const operationType = require('../../const/op-type');

let fn = (renderData) => {
  let { itName, descName, recordAPIs, cmds, defaultWaitFor, previewMode } = renderData;
  let str = `describe('${ descName }', () => {
  let miniProgram;`;

  if (recordAPIs && recordAPIs.length) {
    str += `${mock.mockFn(renderData)};`
  }
  str += beforeAll(renderData);
  str += afterAll(renderData);

  str += `it('${ itName }', async () => {`
  if (recordAPIs && recordAPIs.length) {
    recordAPIs.forEach((api, index) => {
      let ruleKey = `${api}MockRules`;
      str += `
      //【${index + 1}】mock 微信原生 API：${api}
      const ${ruleKey} = ${ previewMode ? '[`...mockDataIgnoredInPreviewMode...`]' : JSON.stringify(renderData[ruleKey]) };`
      str += `await miniProgram.mockWxMethod('${api}', mockFunc, '${api}', ${ruleKey});`
    })
  }


  str += `let page, element, expectResult, actualResult;

    page = await miniProgram.currentPage();`;

  cmds.forEach((item, index) => {
    str += `
     //【${recordAPIs.length + 1 + index}】操作：${operationType[item.command]}
    `;
    if (item.waitfor) {
      str += `
      // 等待时长 ${item.waitfor < 7000 ? item.waitfor : defaultWaitFor}
    await page.waitFor(${item.waitfor < 7000 ? item.waitfor : defaultWaitFor});`
    } else {
      str += `
      // 默认等待时长 ${defaultWaitFor}
    await page.waitFor(${defaultWaitFor});
    `
    }

    str += `page = await miniProgram.currentPage();`;

    if (item.target) {
      str += `
      // getEle by xpath
      element = await page.xpath('${ item.target }');
      `
    }

    if (item.clazz) {
      str += `
      // getEle by class + componentName
      element = await page.$('${ item.clzzName }', '${ item.compName }')`
    }

    if (item.selector) {
      str += `
      // getEle by selector
      element = await page.$('${ item.selector }')
      `
    }

    if (item.command === 'tap') {
      str += ` if (element) {
      // 触发 ${ item.tagName } > ${ item.text } 的 ${ item.command } 事件
      `;
      if (item.eventData) {
        str += ` await element.dispatchEvent({ eventName: '${ item.command }', eventData: ${ JSON.stringify(item.eventData) } });`
      } else {
        str += `await element.tap();
          }`
      }
      str += `} else {
          console.error('element cannot get by ${ item.target || item.clazz || item.compName  || item.selector }')
        }`
    } else if (item.command === 'assertVisible') {
      str += `expect(element).not.toBeNull();`
    } else if (item.command === 'assertPath') {
      str += `page = await miniProgram.currentPage();expect(page.path).toBe('${ item.path }');`
    } else if (item.command === 'dataSnapshot') {
      str += `expectResult = ${ JSON.stringify(item.pageData) };
    actualResult = await page?.data();
    expect(expectResult).toEqual(actualResult);`

    } else if (item.command === 'wxmlSnapshot') {
      str += `expectResult = '${ item.wxml }';
    page = await miniProgram.currentPage();
    element = await page?.$('page');
    actualResult = await element?.outerWxml();
    expect(expectResult).toBe(actualResult);`
    }
  })

  str += `  await page.waitFor(${defaultWaitFor});
  });});`;
  return str;
}

module.exports = fn;
