/// <reference types="node" />
import Application from 'koa';
import { Server } from 'http';
export interface E2eMockConfig {
    staticDir: string;
    port?: number;
}
declare type mockReturnType = void | (() => boolean);
declare class E2eMock {
    staticDir: string;
    mockMap: Map<any, any>;
    server: Application | null;
    connection: Server | undefined;
    constructor(cfg?: E2eMockConfig);
    engineStart(port?: number): void;
    shutdown(): void;
    setMock(path: string, res: Record<string, any>): mockReturnType;
    removeMockFromMap(path: string): boolean;
}
export default E2eMock;
