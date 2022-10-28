let mock = require('./mock');
let beforeAll = require('./beforeAll');
let afterAll = require('./afterAll');
const operationType = require('../../const/op-type');

let fn = (renderData) => {
  let { itName, descName, recordAPIs, cmds, defaultWaitFor, previewMode } = renderData;
  let str = `describe('${ descName }', () => {
  function getValueByPath (object, prop) {
    prop = prop || '';
    const paths = prop.split(/\\.|\\[/g).map(i => i.replace(/\\]/g, ''));
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


  str += `let page, element, expectResult, actualResult, apiResponse, textContent, elementWidth, elementHeight;
    page = await miniProgram.currentPage();`;

  cmds.forEach((item, index) => {
    str += `
     //【${recordAPIs.length + 1 + index}】操作：${item.command && operationType[item.command] && operationType[item.command](item)}
    `;
    if (item.waitfor) {
      str += `
      // 等待时长 ${item.waitfor < 7000 ? item.waitfor : defaultWaitFor}
    await page.waitFor(${item.waitfor < 7000 ? item.waitfor : defaultWaitFor});`
    } else {
    //   str += `
    //   // 默认等待时长 ${defaultWaitFor}
    // await page.waitFor(${defaultWaitFor});
    // `
    }

    str += `page = await miniProgram.currentPage();`;


    if (item.targetCandidates) {
      item.targetCandidates.forEach(i => {
        str+= `
        // getEle by xpath
        element = await page.xpath('${ i }')
        `
      })
    } else if (item.target) {
      str += `
      // getEle by xpath
      element = await page.xpath('${ item.target }');
      `
    }

    if (['tap', 'longpress', 'touchstart', 'touchmove','touchend', 'updated'].includes(item.command)) {
      str += ` if (element) {
      // 触发 ${ item.tagName ? item.tagName + '>' + item.text + '的' + item.command : item.command } 事件
      `;
      if (item.eventData) {
        str += ` await element.dispatchEvent({ eventName: '${ item.command }', eventData: ${ JSON.stringify(item.eventData) } });`
      } else {
        str += `await element.${item.command}(${item.data[0].value});`
      }
      str += `} else {
          console.error('element cannot get by ${ item.target || item.clazz || item.compName  || item.selector }')
        }`
    } else if (item.command === 'input') {
      const currentValue = JSON.stringify(item.value);
      str += `
      // 向表单内输入 ${item.value}
      await element.input(${currentValue});
      `
    } else if (item.command === 'trigger') {
      str += `
      // trigger 元素 ${item.data[0].value} 事件
      await element.trigger({ type: '${item.data[0].value}', detail: ${item.data[1].value} })
      `
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
    } else if (item.command === 'navigateLeft' || item.command === 'operateRouterNavigateBack') {
      str += `
         // 路由回退：${item.command}
         await miniProgram.navigateBack();
      `
    } else if (item.command === 'getDOMIndependently') {
      let compName = item.data[1].value;
      let clazzName = item.data[0].value;
      str += `
      // getEle by class + componentName
      element = await page.$('${clazzName}', '${compName}');`
    } else if (item.command === 'getDOMList') {
      let compName = item.data[1].value;
      let clazzName = item.data[0].value;
      let assignIndex = item.data[2].value;
      str += `
      // getEle by class + componentName
      element = await page.$$('${clazzName}', '${compName}');`
      if (assignIndex) {
        str += `
        // 从列表中获取 索引为 ${assignIndex} 的元素
        element = element[${assignIndex}];
        `
      }
    } else if (item.command === 'screenshotFileSave') {
      let savePath = item.data[1].value;
      let fileName = item.data[0].value;
      str += `
         // 增加截图：
           await miniProgram.screenshot({
              path: '${/(\\|\/)$/g.test(savePath) ? savePath + fileName : savePath + '/' + fileName }'
          });
      `
    } else if (item.command === 'waitForSomeTime') {
      str += `
         // 等待时长：${item.data[0].value}
          await page.waitFor(${item.data[0].value})
      `
    } else if (item.command === 'waitForExactRouter') {
      str += `
        // 等待路由：${item.data[0].value}
        await miniProgram.wait('${item.data[0].value}')
      `
    } else if (item.command === 'waitForApiResponse') {
      str += `
        // 等待接口响应：${item.data[0].value}
        apiResponse = await miniProgram.wait('${item.data[0].value}')
      `
    } else if (item.command === 'assertTextContent') {
      str += `
        // 断言元素内容：${item.data[0].value}
        textContent = await element.text();
        expect(textContent).toBe('${item.data[0].value}')
      `
    } else if (item.command === 'assertTextLength') {
      str += `
        // 断言元素内容长度：${item.data[0].value}
        textContent = await element.text();
        expect(textContent?.length === ${+item.data[0].value}).toBe(true);
      `
    } else if (item.command === 'assertTextByRegExp') {
      str += `
        // 断言元素内容符合正则：/${item.data[0].value}/
        textContent = await element.text();
        expect(new RegExp('${item.data[0].value}', '${item.data[1].value}').test(textContent)).toBe(true);
      `
    } else if (item.command === 'assertElementWidth') {
      str += `
        // 断言元素宽度 ${item.data[0].value} ${item.data[1].value}
        elementWidth = await element.style('width');
        expect(+elementWidth ${item.data[0].value ?? '==='} +${item.data[1].value}).toBe(true);
      `
    } else if (item.command === 'assertElementHeight') {
      str += `
        // 断言元素高度 ${item.data[0].value} ${item.data[1].value}
        elementHeight = await element.style('height');
        expect(+elementHeight ${item.data[0].value ?? '==='} +${item.data[1].value}).toBe(true);
      `
    } else if (item.command === 'assertElementExistence') {
      str += `
        // 断言元素是否存在：
        expect(element).not.toBeNull();
      `
    } else if (item.command === 'assertResponseFiledValue') {
      str += `
      // 通过取值表达式取值 ${item.data[1].value} ${item.data[2].value}
      apiResponse = getValueByPath(apiResponse, '${item.data[0].value}');
      expect(apiResponse ${item.data[1].value} ${item.data[2].value}).toBe(true);
      `
    } else if (item.command === 'operateRouterRelaunch') {

      str += `
      // 操作路由 ReLaunch ${item.data[0].value}
      await miniProgram.reLaunch('${item.data[0].value}');
      `
    } else if (item.command === 'operateRouterNavigateTo') {
      str += `
      // 操作路由 NavigateTo ${item.data[0].value}
      await miniProgram.navigateTo('${item.data[0].value}');
      `
    } else if (item.command === 'operateRouterRedirectTo') {
      str += `
      // 操作路由 redirectTo ${item.data[0].value}
      await miniProgram.redirectTo('${item.data[0].value}');
      `
    } else if (item.command === 'operateRouterSwitchTab') {
      str += `
      // 操作路由 redirectTo ${item.data[0].value}
      await miniProgram.switchTab('${item.data[0].value}');
      `
    }

  });

  str += `
  });});`;
  return str;
}

module.exports = fn;
