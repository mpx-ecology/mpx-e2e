import axios from 'axios'
import type { AxiosResponse, Method } from 'axios'
import type { CommonRequestCfg } from '../../types/request'

const ts = function () {
	return '?ts=' + new Date().getTime()
}

const http = {
	commonRequest (method: Method, url: string, {
		noCache= true,
		cancelToken = null,
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
				const { data } = res
				resolve(data)
			})
		})
	},
	get (url: string, params?: Record<any, any>, cfg?: CommonRequestCfg) {
		return http.commonRequest('GET', url, Object.assign({ params }, cfg))
	},
	post (url: string, data: Record<any, any>, cfg?: CommonRequestCfg) {
		return http.commonRequest('POST', url, Object.assign({ data } , cfg))
	}
}

export const IS_DEV = import.meta.env.DEV

export default http
