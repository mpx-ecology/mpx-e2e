import { CancelToken } from 'axios'

export interface CommonRequestCfg {
	noCache?: boolean;
	headers?: Record<string, any>;
	data?: Record<any, any> | undefined;
	params?: any;
	cancelToken?: CancelToken | undefined;
}
