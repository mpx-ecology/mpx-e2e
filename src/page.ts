
/**
 * 获取元素方法
 * @param fn 获取元素的原生方法
 * @param className 类名
 * @param componentsName 组件名拆分的数组
 * @returns 返回Promise<元素>
 */

 async function $(fn: (selector: string) => Promise<Element | null>, className: string, componentsName?: string) {
  if (!componentsName) {
    return await fn('.' + className)
  }
  const componetsNameArr = componentsName.split(/\/|-/)
  return await _getDOM(fn, componetsNameArr, className)
}

/**
 * 迭代尝试元素可能的类名，从而拿到元素，1-2次即可拿到，一般不会执行到3-4次
 * @param fn 获取元素的原生方法
 * @param componetsNameArr 组件名拆分的数组
 * @param clazz 类名
 * @param joinArr 辅助数组
 * @returns 返回Promise<元素>
 */
async function _getDOM(fn: (selector: string) => Promise<Element | null>, componetsNameArr: string[], clazz: string, joinArr = []) {
  const probeArray = [...componetsNameArr]
  async function getDOMItem ():Promise<Element | null> {
    return new Promise(async resolve => {
      joinArr.unshift(probeArray.pop() as never)
      let s = '.' + joinArr.join('-') + '--' + clazz
      let dom = await fn(s)
      // let dom = isSingle$ ? await ctx.$(s) : await ctx.$$(s)
      console.log(s, dom)
      const isEmptyArr = Array.isArray(dom) && !dom.length
      if ((!dom || isEmptyArr) && !probeArray.length) return resolve(null)
      // console.log(dom === null, Array.isArray(dom) && !dom.length, 'Array.isArray(dom) && !dom.length')
      // console.log(dom)
      return dom === null || isEmptyArr ? await getDOMItem().then(resolve) : resolve(dom)
    })
  }
  return await getDOMItem()
}

export default class Page {
  constructor (page: any) {
    const new$ = page.$
    const new$$ = page.$$
    const newPage = Object.create(page)
    // 重写page和element的$,$$方法
    newPage.$ = async (className: string, componentsName?: string): Promise<Element | any> => {
      const element = await $(s => new$.call(page, s), className, componentsName)
      return element ? new Page(element) : element
    }
    newPage.$$ = async (className: string, componentsName?: string): Promise<Element | any> => {
      const element = await $(s => new$$.call(page, s), className, componentsName)
      return element ? new Page(element) : element
    }
    return newPage
  }
}