type MiniProgram = import('miniprogram-automator/out/MiniProgram').default
type Element = import('miniprogram-automator/out/Element').default
type Page = import('miniprogram-automator/out/Page').default
let miniProgram: MiniProgram
type curWaitPage = {
  path: string
  resolve: any
}

let curWaitPage: curWaitPage

async function init(miniP: MiniProgram) {
  miniProgram = miniP
  await miniProgram.exposeFunction('onPageReady', (options: any) => {
    console.log(options, '经过的path')
    if (curWaitPage.path === options) {
      console.log(options, '命中path')
      curWaitPage.resolve(options)
      curWaitPage.path = ''
    }
  })
}

async function wait(path: string, timeout?: number) {
  await new Promise(async (resolve, reject) => {
    console.log(path, '期望进入的path')
    const curPath = await getCurPagePath()
    if (curPath === path) {
      return resolve(path)
    }
    curWaitPage = {
      path,
      resolve
    }
    if (timeout) {
      setTimeout(reject, timeout)
    }
  })
}

async function $(ctx: Page | Element, className: string, componentsName?: string) {
  if (!componentsName) {
    return await ctx.$(className)
  }
  const componetsNameArr = componentsName.split(/\/|-/)

  return await _getDOM(ctx, componetsNameArr, className)
}

async function _getDOM(ctx: Page | Element, probeArray: string[], clazz: string, joinArr = []) {
  async function getDOMItem ():Promise<Element> {
    return new Promise(async (resolve, reject) => {
      joinArr.unshift(probeArray.pop() as never)
      let s = '.' + joinArr.join('-') + '--' + clazz
      let dom = await ctx.$(s)
      if (!dom && !probeArray.length) return reject(null)
      return dom ? resolve(dom) : getDOMItem().then(resolve)
    })
  }
  return await getDOMItem()
}

async function getCurPage(miniP: MiniProgram = miniProgram) {
  const curPage = await miniP.currentPage()
  return curPage
}

async function getCurPagePath(miniP: MiniProgram = miniProgram) {
  const curPage = await getCurPage(miniP)
  return curPage ? curPage.path : 'error'
}

function consoleWxml (element: Element) {
  element && element.wxml().then((data:any) => console.log(data))
}

export {
  $,
  init,
  wait,
  getCurPage,
  getCurPagePath,
  consoleWxml
}

