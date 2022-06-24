const fs = require('fs')
const path = require('path')

class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    // console.log('Custom reporter output:');
    // console.log('GlobalConfig: ', contexts);
    // console.log('Options: ', results);
  }

  onTestResult(test, testResult, aggregatedResult) {
    // console.log('onTestResult:');
    // console.log('test: ', test);
    // console.log('testResult: ', testResult);
    // console.log('aggregatedResult: ', aggregatedResult);
    const dist = path.resolve(__dirname, './testResult.json')
    const oldFile = fs.readFileSync(dist, 'utf8')
    const data = JSON.parse(oldFile)
    const reportList = data.reportList
    testResult.imgList = data.imgList || []
    if (Array.isArray(reportList)) {
      reportList.push(testResult)
    } else {
      data.reportList = [testResult]
    }
    delete data.imgList
    fs.writeFileSync(dist, JSON.stringify(data))
  }

  onRunStart(results, options) {
    // console.log('onRunStart:');
    // console.log('results: ', results);
    // console.log('Options: ', options);
  }

  onTestStart(test) {
    // console.log('onTestStart:');
    // console.log('test: ', test);
  }

  getLastError() {
    if (this._shouldFail) {
      return new Error('my-custom-reporter.js reported an error');
    }
  }
}

module.exports = MyCustomReporter;