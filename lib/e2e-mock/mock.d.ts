import Application from 'koa';
export interface E2eMockConfig {
    staticDir: string;
}
declare type mockReturnType = void | (() => boolean);
declare class E2eMock {
    staticDir: string;
    mockMap: Map<any, any>;
    server: Application | null;
    constructor(cfg?: E2eMockConfig);
    engineStart(port?: number): void;
    setMock(path: string, res: Record<string, any>): mockReturnType;
    removeMockFromMap(path: string): boolean;
}
export default E2eMock;
