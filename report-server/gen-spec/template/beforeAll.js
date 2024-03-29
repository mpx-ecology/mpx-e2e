let fn = ({ connectFirst, needRealMachine, jestTimeout, wsEndpoint, insertCode }) => {
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


    str += `
    if (e2eRc.needRealMachine) {
    await miniProgram.remote();
     }
    `
  str += insertCode?.type === 'beforeAll' ? `${insertCode.codeStr}` : ''

  str += `},
  ${jestTimeout});`
  return str
}

module.exports = fn;
// console.log(fn({ connectFirst: 1, needRealMachine: 1, jestTimeout: 300000, wsEndpoint: 'ws:localhost:2023' }))
