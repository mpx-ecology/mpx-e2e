import axios, { AxiosResponse, Method } from 'axios'
import type { CommonRequestCfg } from '../../types/request'

const ts = function () {
	return '?ts=' + new Date().getTime()
}

const http = {
	commonRequest (method: Method, url: string, {
		noCache,
		cancelToken ,
		headers = {},
		data = {},
		params = {}
	} = ({} as CommonRequestCfg)) {
		return new Promise((resolve, reject) => {
			axios.request<AxiosResponse>({
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
				let { data } = res
				resolve(data)
			})
		})
	},
	get (url: string, params?: Record<any, any>, cfg?: CommonRequestCfg) {
		return http.commonRequest('GET', url, Object.assign({ params }, cfg))
	},
	post (url: string, data: Record<any, any>, cfg: CommonRequestCfg) {
		return http.commonRequest('POST', url, Object.assign({ data } , cfg))
	}
}

export const IS_DEV = import.meta.env.DEV

export default http
