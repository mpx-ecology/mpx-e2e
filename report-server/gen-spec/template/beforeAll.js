let fn = ({ connectFirst, needRealMachine, jestTimeout, wsEndpoint }) => {
  let str = 'beforeAll(async () => {'
  if (connectFirst) {
    str += ` try {
      miniProgram = await automator.connect({
        wsEndpoint: '${wsEndpoint}'
      })
    } catch (e) {
      miniProgram = await automator.launch({
        projectPath: e2eRc.projectPath,
      })
    }`
  } else {
    str += ` miniProgram = await automator.launch({
         projectPath: e2eRc.projectPath,
      });`
  }

  if (needRealMachine) {
    str += `await miniProgram.remote();`
  }

  str += `},
  ${jestTimeout});`
  return str
}

module.exports = fn;
// console.log(fn({ connectFirst: 1, needRealMachine: 1, jestTimeout: 300000, wsEndpoint: 'ws:localhost:2023' }))
