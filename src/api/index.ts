import { Api, ApiResponse } from '@/api/type.ts'
import { apiConfig } from '@/config'
import { routes } from '@generouted/react-router'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
const client = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 5000,
})

client.interceptors.response.use(
  (response) => response,
  function (error) {
    if (error.code === 'ECONNABORTED' && error.message.startsWith('timeout')) {
      return Promise.reject('请求超时')
    }
    if (error.response.status === 401) {
      routes.push({ path: '/login' })
      return Promise.reject('Token 失效')
    }
    if (error.response.status === 500) {
      routes.push({ path: '/login' })
      return Promise.reject('服务器内部错误')
    }

    return Promise.reject(error)
  },
)
export async function DoRequest<ApiType extends Api>(
  path: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  requestBody: ApiType['request'],
  withToken: boolean = true,
): Promise<ApiType['response']> {
  const requestConfig: AxiosRequestConfig = {
    url: path,
    method,
  }

  if (withToken) {
    // if (!token) {
    //   throw 'Token 为空，请先登录'
    // }
    //   requestConfig['headers'] = {
    //     Authorization: `Bearer ${token}`,
    //   }
  }
  if (['get', 'delete'].includes(method)) {
    requestConfig['params'] = requestBody
  } else {
    requestConfig['data'] = requestBody
  }
  let resp: AxiosResponse<ApiType['response'], any>
  try {
    resp = await client.request<ApiType['response']>(requestConfig)
  } catch (error) {
    throw `请求 API 失败：${error}`
  }
  const data: ApiResponse<unknown> = resp.data
  if (!data.success) {
    throw data.errorMsg ?? '未知错误'
  }
  return data
}
export async function DoRequestWithErrorMessage<ApiType extends Api>(
  path: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  requestBody: ApiType['request'],
  withToken: boolean = true,
) {
  try {
    const resp = await DoRequest(path, method, requestBody, withToken)
    return resp
  } catch (error) {
    return Promise.reject(error)
  }
}
