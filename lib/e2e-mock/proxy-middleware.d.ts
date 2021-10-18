import Application from 'koa';
declare function proxyMiddleware(mockMap: Map<string, any>): (ctx: Application.DefaultContext, next: Application.Next) => Promise<any>;
export default proxyMiddleware;
