

import { http } from "@/utils/http";
import { ApiResponse, LoginParams, LoginResponse } from "./types";


export function loginApi(data: LoginParams) {
    return http.post<ApiResponse<LoginResponse>>("/api/account/login", { data: data })
}

export function getDemoApi() {
    return http.post<ApiResponse<LoginResponse>>("/api/account/demo")
}