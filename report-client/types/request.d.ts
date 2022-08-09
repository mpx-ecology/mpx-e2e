import { CancelToken } from 'axios'

export interface CommonRequestCfg {
	noCache: boolean,
	headers: Record<string, any>,
	data?: Record<any, any>,
	params?: Record<string, any>
	cancelToken?: CancelToken
}
