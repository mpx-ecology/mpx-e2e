# e2e-extension

基于官方自动化库`miniprogram-automator`上进行了封装，提供了wait模式和mock的功能，另外获取dom元素更加稳定便捷。

## 前置

> mpx低版本需要在creatApp()上挂载xfetch, mixin(mpx@2.6.106版本以上则无需此步骤)

```ts
  createApp({
    mixin: mpx.mixin.
    xfetch: mpx.xfetch
  })
```

## API

## 1. Automator

> Automator 模块提供了启动及连接开发者工具的方法。

[继承微信自动化sdk](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/automator.html)

【新增方法】
### 1.1 initMock

> 初始化mock，提供mock需要的配置可实现本地mock或更改接口返回参数

```ts
  interface E2eMockConfig {
    staticDir: string, // 本地文件目录：
    debug: boolean // debug模式
  }

  Automator.initMock(mockCfg: E2eMockConfig): Promise<MiniProgram>
```

### 1.2 setMock

> 设置需要mock的路径和返回结果

```ts
  Automator.setMock (path:string, response:any): () => void

  // 示例：
  let un = Automator.setMock('https://api.hongyibo.com.cn/gulfstream/pre-sale/v1/other/pGetIndexInfo', {
    errno: 0,
    errmsg: 'mock-index-info',
    data: {
      a: 1,
      b: 2,
      c: 3
    }
  });

  // 需要取消时可以调用 un，注意这一步骤非必须！！
  un(); 
```

参数：
1. path: 接口
2. response: 该接口响应的 mock 数据

返回值：取消函数，调用该函数即可从 mock map 中移除该 mock

### 1.3 removeMockFromMap

> 从 mock map 中移除指定 path 对应的的 mock 数据；

```ts
  Automator.removeMockFromMap (path:string): void
```

## 2. Miniprogram
[继承微信自动化sdk](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/miniprogram.html)

【新增方法】
### 2.1 wait

> 稳定等待['页面', '组件', '组件更新', '接口发起', '接口返回']，解决waitFor不能解决时间不确定的情况，发生报错。并且增加多种等待时机，更加掌控e2e流程


```ts

  wait(path: string, type?: string): Promise<string | undefined> | void;

  const miniProgram = await Automator.launch({
    projectPath: './dist/wx'
  })
  // 页面
  page = await miniProgram.reLaunch('/pages/index/index')
  await miniProgram.wait('pages/index/index')
  // 组件
  const suggest1 = await miniProgram.wait('suggest/components/suggestcaafe3e4/suggest', 'component')

  // 组件更新
  const suggest2 = await miniProgram.wait('suggest/components/suggestcaafe3e4/suggest', 'componentUpdate')

  // 请求
  const request = await miniProgram.wait('https://xxxx.xxx/xxx', 'request')

  // 返回结果
  const response = await miniProgram.wait('https://xxxx.xxx/xxx', 'response')
  expect(response.options.data.errno).toBe(0)
  const data = response.options.data.data
  expect(data.status).toBe(1)

```

### 2.2 waitAll

> 同时等待多个操作

```ts
  waitAll<T> (args:[Promise<T>]): Promise<any>

  const [suggest] = await miniProgram.waitAll(miniProgram.wait('suggest/suggestcaafe3e4/suggest'), inputbtn.tap())

```

### 2.3 currentPagePath

> 获取当前页面的路径

```ts
  const curPath = await miniProgram.currentPagePath()
  expect(curPath).toBe('pages/index/index')
```

## 3 Page

[继承微信自动化sdk](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/page.html)

【重写方法】重写page和element的$,$$方法
### 3.1 $

> 获取dom元素，不同官方$的是，配合components名称可获取自定义组件中的元素，解决官方$获取不到的问题。(不传入components名称则走微信原生方式获取)
> 切忌传入组件名只能和class选择器配合使用，其他选择器方式可用原生方式

```ts
  $(className: string, componentsName?: string): Promise<Element | any>

  const confirmbtn = await page.$('confirm-btn', 'homepage/components/confirmef91faba/confirm')

  const confirmbtn2 = await page.$('.confirm-btn')
  const view = await page.$('view')
  const id = await page.$('#id')
```

### 3.2 $$

> \$\$同$

```ts
  $(className: string, componentsName?: string): Promise<any>
  const btns = await page.$$('confirm-btn', 'homepage/components/btnf91faba/btn')
```

## FAQ

- $方法为什么取不到dom元素？
  > 可能存在以下几种情况
  
  1. dom类名不对，或者组件名不对，或者类名和组件名不匹配
  2. page对象没有更新，如果跳转到某一个页面，需要重新赋值page即:
  ```ts
    page = await miniProgram.currentPage()
  ```
  3. dom元素未渲染，即可能用wx:if控制的元素，如需要获取一定要保证该元素在获取时渲染在模拟器或者真机上

- 组件名的hash值一改动代码就会发生变化，如何固定hash？
  
  在构建配置中加入此参数
  ```ts
    new MpxWebpackPlugin({
      pathHashMode: 'relative' // 可保证hash不变
    })
  ```

- `<web-view>`中的内容能自动化测试吗？

  不能，web-view中的内容无法获取到

- 登录功能能自动化测试吗？

  不能，工具无法操作原生的授权弹窗

- 可以不用jest配合测试吗？

  可以，你可以把这个库理解成调用微信ide的工具库，jest是测试框架的一种，两者配合使用可以达到你想要的效果



