# e2e-extension

基于官方自动化库`miniprogram-automator`上进行了封装，提供了wait模式和mock的功能，另外获取dom元素更加稳定便捷。

## API

## Automator
> Automator 模块提供了启动及连接开发者工具的方法。

[继承微信自动化sdk](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/automator.html)

【新增方法】
### initMock

> 初始化mock，提供mock需要的配置可实现本地mock或更改接口返回参数

```
interface E2eMockConfig {
  useStatic: boolean, // 使用本地文件
  staticDir: string, // 本地文件目录
  debug: boolean // debug模式
}

Automator.initMock(mockCfg: E2eMockConfig): Promise<MiniProgram>
```

### setMock

> 设置需要mock的路径和返回结果
```
Automator.setMock (path:string, response:any): void
```
## Miniprogram
[继承微信自动化sdk](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/miniprogram.html)

【新增方法】
### wait

> 稳定等待['页面', '组件', '组件更新', '接口发起', '接口返回']，解决waitFor不能解决时间不确定的情况，发生报错。并且增加多种等待时机，更加掌控e2e流程


```
const miniProgram = await Automator.launch({
  projectPath: './dist/wx'
})
// 页面
page = await miniProgram.reLaunch('/pages/index/index')
await miniProgram.wait('pages/index/index')
// 组件
const suggest1 = await miniProgram.wait('suggest/components/suggestcaafe3e4/suggest', 'component', 800)

// 组件更新
const suggest2 = await miniProgram.wait('suggest/components/suggestcaafe3e4/suggest', 'componentUpdate', 800)

// 请求
const request = await miniProgram.wait('https://xxxx.xxx/xxx', 'request')

// 返回结果
const response = await miniProgram.wait('https://xxxx.xxx/xxx')
expect(response.options.data.errno).toBe(0)
const data = response.options.data.data
expect(data.status).toBe(1)

```

### waitAll

> 同时等待多个操作

```
waitAll<T> (args:[Promise<T>]): Promise<any>

const [suggest] = await miniProgram.waitAll(miniProgram.wait('suggest/suggestcaafe3e4/suggest'), inputbtn.tap())

```

### currentPagePath

> 获取当前页面的路径

```
const curPath = await miniProgram.currentPagePath()
expect(curPath).toBe('pages/index/index')
```

## Page
[继承微信自动化sdk](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/page.html)

【重写方法】重写page和element的$,$$方法
### $

> 获取dom元素，不同官方$的是，配合components名称可获取自定义组件中的元素，解决官方$获取不到的问题
```
$(className: string, componentsName?: string): Promise<Element | any>

const confirmbtn = await page.$('confirm-btn', 'homepage/components/confirmef91faba/confirm')
```

### $$
> \$\$同$

```
$(className: string, componentsName?: string): Promise<any>

const btns = await page.$$('confirm-btn', 'homepage/components/btnf91faba/btn')

```


