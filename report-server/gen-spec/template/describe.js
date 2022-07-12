let mock = require('./mock');
let beforeAll = require('./beforeAll');
let afterAll = require('./afterAll');

let fn = (renderData) => {
  let { itName, descName, mockRules, cmds, defaultWaitFor } = renderData;
  let str = `describe('${ descName }', () => {
  let miniProgram;`;

  if (mockRules) {
    str += `${mock.mockFn()}`
  }

  str += beforeAll(renderData);
  str += afterAll(renderData);

  str += `it('${ itName }', async () => {`
  if (mockRules) {
    str += `const requestMockRules = ${ JSON.stringify(mockRules) };`
    str += `await miniProgram.mockWxMethod('request', mockFunc, requestMockRules);`
  }

  str += `let page, element, expectResult, actualResult;

    page = await miniProgram.currentPage();`;

  cmds.forEach(item => {
    if (item.waitfor) {
      str += `// 等待时长 ${item.waitfor}
    await page.waitFor(${item.waitfor});`
    } else {
      str += `// 默认等待时长 ${defaultWaitFor}
    await page.waitFor(${defaultWaitFor});
    `
    }

    str += `page = await miniProgram.currentPage();`;

    if (item.target) {
      str += `// getEle by xpath
      element = await page.xpath('${ item.target }');
      `
    }

    if (item.clazz) {
      str += `// getEle by class + componentName
      element = await page.$('${ item.clzzName }', '${ item.compName }')`
    }

    if (item.selector) {
      str += `// getEle by selector
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

  str += `  await page.waitFor(10000);
  });});`;
  return str;
}

module.exports = fn;
