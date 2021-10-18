declare type MiniProgram = import('miniprogram-automator/out/MiniProgram').default;
declare type Element = import('miniprogram-automator/out/Element').default;
export default class EMiniProgram {
    private miniProgram;
    private curWaitPage;
    private curWaitRequest;
    private curWaitResponse;
    private curWaitComponent;
    private curWaitComponentUpdate;
    private hasAbility;
    private cachePageStack;
    constructor(options: MiniProgram);
    /** 返回当前页面路径 */
    currentPagePath(): Promise<string | undefined>;
    /** 可以等待五种种类型 页面 发请求 请求返回 组件渲染 组件更新 */
    wait(path: string, type?: string, timeout?: number): Promise<string | undefined> | void;
    waitAll<T>(...args: [Promise<T>]): Promise<any>;
    /** 打印元素日志 */
    consoleWxml(element: Element): void;
    /** 初始化工作 */
    init(): Promise<void>;
}
export {};
