const mockFunc = function mockFunc() {
  function matchFilter(filterList, args) {
    for (let i = 0, len = filterList.length; i < len; ++i) {
      const filter = filterList[i];
      let objUrl = /(^[^?]+)/g.exec(args[filter.propName])[1];

      if (!filter.propName) continue;
      if (!args) return false;

      if (typeof args[filter.propName] === 'undefined') {
        return false;
      } else if (
        filter.matchType === 'string' &&
        filter.propRegString && !filter.propRegString.includes(objUrl)
      ) {
        return false;
      } else if (
        filter.matchType !== 'string' &&
        new RegExp(filter.propRegString, 'i').test(args[filter.propName])
      ) {
        return false;
      }
    }
    return true;
  }

  if (!this.mockRuleMap) {
    this.mockRuleMap = {};
  }

  const args = Array.from(arguments);
  const requestMockRules = args[args.length - 1];
  const apiType = args[args.length - 2];
  const argsOrigin = args.slice(0, -1);
  let isSync = false;
  let obj = isSync ? argsOrigin : argsOrigin[0];
  for (rule of requestMockRules) {
    let res = { errMsg: rule.apiName + ' fail in mock' };
    isSync = rule.apiName.endsWith('Sync') || rule.isSync;
    obj = isSync ? argsOrigin : argsOrigin[0];

    const isMatch = matchFilter(rule.filterList, obj, {});

    if (!this.mockRuleMap[rule.ruleId] && isMatch) {
      this.mockRuleMap[rule.ruleId] = true;
      const resStr = rule.returnConfig.manual.succ.resStr;
      try {
        res = resStr ? JSON.parse(resStr) : {};
      } catch (e) {
        console.error('[autotest] mock failed:', resStr);
        res = isSync ? resStr : res;
      }
      try {
        let objUrl = obj.url && /(^[^?]+)/g.exec(obj.url)[1];
        if (obj.url) {
          console.log('e2e-mock-log: ->', objUrl, res.data);
        }
      } catch (e) {
        console.log('预估结果错误：->', e)
      }
      return res;
    }
  }
  if (isSync) {
    return this.origin(...argsOrigin);
  } else {
    return new Promise((resolve) => {
      this.origin({
        ...obj,
        complete(res) {
          resolve(res);
        },
      });
    });
  }
};

exports.mockFn = () => `const mockFunc = ${mockFunc.toString()}`;

