export type ImgType = 'error' | 'tap' | 'timeout' | 'user' | 'route'| 'request'

export interface ImgItem {
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
  }
 }

 export interface ErrorItem {
   message: string,
   stack: string,
   page: string,
   src: string,
   file?: string
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
  testFilePath: string,
  testResults: TestResults[],
  imgList: ImgItem[],
  errorList: ErrorItem[]
  failureMessage: null,
  expectCount: number
}

export type SystemInfo = {
  brand: string,
  model: string,
  platform: string,
  screenHeight: number,
  screenWidth: number,
  system: string,
}