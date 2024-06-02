import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

class httpClient {
  // axios 实例
  instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(
      (res: InternalAxiosRequestConfig) => {
        console.log('全局请求拦截器')
        return res
      },
      (err: any) => err
    )
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res: AxiosResponse) => {
        console.log('全局响应拦截器')
        return res.data
      },
      (err: any) => err
    )
  }
  request(config: AxiosRequestConfig) {
    return this.instance.request(config)
  }
}

export default httpClient
