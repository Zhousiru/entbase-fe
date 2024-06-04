import { apiConfig } from '@/config'
import axios from 'axios'
import { InvalidTokenError, getValidToken } from './token'
import { Api } from './types'

export const $axios = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 5000,
})

$axios.interceptors.request.use(
  (config) => {
    const url = config.url

    if (url && apiConfig.protectedUrls.some((x) => url.startsWith(x))) {
      config.headers.Authorization = getValidToken()
    }

    return config
  },
  (error) => Promise.reject(error),
)

$axios.interceptors.response.use(
  (response) => {
    const respData: Api<unknown> = response.data

    if (!respData.success) {
      if (respData.errorMsg === 'NOT_LOGIN') {
        throw new InvalidTokenError()
      }
      throw new Error(respData.errorMsg)
    }

    return {
      ...response,
      respData,
    }
  },
  (error) => Promise.reject(error),
)
