import { IConnectOptions, ILaunchOptions } from 'miniprogram-automator/out/Launcher';
import E2eMock, { E2eMockConfig } from './e2e-mock/mock';
export default class Automator {
    mockHelper?: E2eMock;
    connect(options: IConnectOptions): Promise<any>;
    launch(options: ILaunchOptions): Promise<any>;
    initMock(mockCfg: E2eMockConfig): void;
    setMock(path: string, response: Record<any, any>): void | (() => boolean);
    removeMockFromMap(path: string): void | boolean;
}
