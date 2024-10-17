import request from '@/utils/http'

export function getAppConfig(data?: any) {
    return request({
        url: '/api/xxxx', // url会和request中定义的baseURL拼接成地址
        method: 'get',
        params: data,
    })
}