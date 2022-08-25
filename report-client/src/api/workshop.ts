import http from './xFetch'
import { IS_DEV } from './xFetch'
import type {LOAD_CASE_RESPONSE} from "@/types/genCaseType";

const HOST = IS_DEV ? 'http://localhost:8886' : location.origin

export const getJsonFiles = (params: Record<any, any>): Promise<LOAD_CASE_RESPONSE> => http.get(`${HOST}/gen/loadCase`, params)

export const previewAfterExtended = (data: Record<any, any>) => http.post(`${HOST}/gen/editAndPreviewCase`, data)

export const saveSpecFileAndJSON = (data: Record<any, any>) => http.post(`${HOST}/gen/saveSpecAndJson`, data)
