import { MockMethod } from 'vite-plugin-mock'

export default [
    {
        url: '/api/account/login',
        method: 'post',
        statusCode: 200,
        response: ({ body }) => {
            return {
                code: 401,
                message: '登录成功',
                data: {
                    token: '123456',
                },
            }
        },
    },
    {
        url: '/api/account/demo',
        method: 'post',
        statusCode: 401,
        response: ({ body }) => {
            return {
                code: 401,
                message: '登录成功',
                data: {
                    token: '123456',
                },
            }
        },
    },
] as MockMethod[]
