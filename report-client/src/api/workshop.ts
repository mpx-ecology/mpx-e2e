import http from './xFetch'
import { IS_DEV } from './xFetch'

const HOST = IS_DEV ? 'http://localhost:8886' : location.origin

export const getJsonFiles = (params: Record<any, any>) => http.get(`${HOST}/gen/loadCase`, params)
