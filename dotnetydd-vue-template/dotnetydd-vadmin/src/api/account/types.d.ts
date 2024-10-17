export type LoginParams = {
    name: string
    pass: string
}

export type ApiResponse<T = any> = {
    code: string
    msg: string
    data: T
}

export type LoginResponse = {
    token: string
}
