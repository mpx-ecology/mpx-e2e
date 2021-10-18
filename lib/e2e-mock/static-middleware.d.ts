import Application from 'koa';
declare const e2eMockStatic: (dirname: string) => (ctx: Application.DefaultContext, next: Application.Next) => Promise<any>;
export default e2eMockStatic;
