export type ImgType = 'error' | 'tap' | 'timeout' | 'user' | 'route'| 'request'

export interface EventData {
  clientX: number,
  clientY: number,
  pageX: number,
  pageY: number,
  radiusX: number,
  radiusY: number,
  screenX: number,
  screenY: number,
}

 export interface Img{
  path: string,
  src: string,
  time: number,
  page: string,
  type: ImgType
  size?: {
    width: number,
    height: number,
  },
  offset?: {
    left: number,
    top: number
  },
  systemInfo?: {
    windowWidth: number,
    windowHeight: number
  },
  event?: {
    eventName: string,
    eventData: {
      detail?: Record<string, unknown>,
      changedTouches?: EventData[]
    }
  }
 }

 export interface PerfStats {
  end: number,
  runtime: number,
  slow: boolean,
  start: number
 }

 export interface TestResults {
  ancestorTitles: string[],
  duration: number,
  failureDetails: string[],
  failureMessages: string[],
  fullName: string,
  invocations: number,
  location: string,
  status: string,
  title: string
 }
 
 export type Report = {
  leaks: boolean,
  numFailingTests: number,
  numPassingTests: number,
  numPendingTests: number,
  numTodoTests: number,
  openHandles: [],
  perfStats: PerfStats,
  skipped: number,
  // snapshot: any,
  testFilePath: string,
  testResults: TestResults[],
  imgList: Img[],
  failureMessage: null,
  expectCount: number
}

export type SystemInfo = {
  windowWidth: number,
  windowHeight: number
}