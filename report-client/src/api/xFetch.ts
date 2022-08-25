import axios from 'axios'
import type { AxiosResponse, Method } from 'axios'
import type { CommonRequestCfg } from '../../types/request'

const ts = function () {
	return '?ts=' + new Date().getTime()
}

const http = {
	commonRequest <T>(method: Method, url: string, {
		noCache= true,
		cancelToken,
		headers = {},
		data = {},
		params = {}
	}: Record<any, any>) {
		return new Promise<T>((resolve, reject) => {
			axios.request<T>({
				url: noCache ? url : (url + ts()),
				data,
				params,
				headers,
				cancelToken,
				method
			}).catch(err => {
				reject(err)
			}).then(res => {
				if (!res || (+res.status !== 200 || !res.data)) return reject(res)
				const { data } = res
				resolve(data)
			})
		})
	},
	get <G>(url: string, params?: any, cfg?: Record<any, any>) {
		return http.commonRequest<G>('GET', url, { params, ...cfg })
	},
	post <G>(url: string, data: Record<any, any>, cfg?: Partial<CommonRequestCfg>) {
		return http.commonRequest<G>('POST', url, Object.assign({ data } , cfg))
	}
}

export const IS_DEV = import.meta.env.DEV

export default http
