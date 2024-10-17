import Axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type CustomParamsSerializer
} from "axios";
import { stringify } from "qs";
import { formatToken } from "../auth";
import type {
    PureHttpError,
    PureHttpRequestConfig,
    PureHttpResponse,
    RequestMethods
} from "./types";


import { redirectToLogin } from "../auth";


const defaultConfig: AxiosRequestConfig = {
    // 请求超时时间
    timeout: 10000,
    headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
    },
    paramsSerializer: {
        serialize: stringify as unknown as CustomParamsSerializer
    }
};


class PureHttp {
    constructor() {
        this.httpInterceptorsRequest();
        this.httpInterceptorsResponse();
    }

    /** `token`过期后，暂存待执行的请求 */
    private static requests = [] as any[];

    /** 防止重复刷新`token` */
    // @ts-ignore
    private static isRefreshing = false;

    /** 初始化配置对象 */
    private static initConfig: PureHttpRequestConfig = {};

    /** 保存当前`Axios`实例对象 */
    private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);


    /** 重连原始请求 */
    // @ts-ignore
    private static retryOriginalRequest(config: PureHttpRequestConfig) {
        return new Promise(resolve => {
            PureHttp.requests.push((token: string) => {
                if (config.headers) {
                    config.headers["Authorization"] = formatToken(token);
                }
                resolve(config);
            });
        });
    }


    private httpInterceptorsRequest(): void {
        PureHttp.axiosInstance.interceptors.request.use(
            async (config: PureHttpRequestConfig): Promise<any> => {

                // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
                if (typeof config.beforeRequestCallback === "function") {
                    config.beforeRequestCallback(config);
                    return config;
                }
                if (PureHttp.initConfig.beforeRequestCallback) {
                    PureHttp.initConfig.beforeRequestCallback(config);
                    return config;
                }

                return config
            },
            (error) => {
                return Promise.reject(error)
            },
        )
    }

    /** 响应拦截 */
    private httpInterceptorsResponse(): void {
        const instance = PureHttp.axiosInstance;
        instance.interceptors.response.use(
            (response: PureHttpResponse) => {
                const $config = response.config;
                // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
                if (typeof $config.beforeResponseCallback === "function") {
                    $config.beforeResponseCallback(response);
                    return response.data;
                }
                if (PureHttp.initConfig.beforeResponseCallback) {
                    PureHttp.initConfig.beforeResponseCallback(response);
                    return response.data;
                }
                return response.data;
            },
            (error: PureHttpError) => {
                const $error = error;
                $error.isCancelRequest = Axios.isCancel($error);

                // 检查HTTP状态码是否为401
                if ($error.response && $error.response.status === 401) {
                    // 跳转到登录页面
                    redirectToLogin();
                }

                return Promise.reject($error);
            }
        );
    }


    /** 通用请求工具函数 */
    public request<T>(
        method: RequestMethods,
        url: string,
        param?: AxiosRequestConfig,
        axiosConfig?: PureHttpRequestConfig
    ): Promise<T> {
        const config = {
            method,
            url,
            ...param,
            ...axiosConfig
        } as PureHttpRequestConfig;

        // 单独处理自定义请求/响应回调
        return new Promise((resolve, reject) => {
            PureHttp.axiosInstance
                .request(config)
                .then((response) => {
                    resolve(response as T);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /** 单独抽离的`post`工具函数 */
    public post<T, P = any>(
        url: string,
        params?: AxiosRequestConfig<P>,
        config?: PureHttpRequestConfig
    ): Promise<T> {
        return this.request<T>("post", url, params, config);
    }

    /** 单独抽离的`get`工具函数 */
    public get<T, P = any>(
        url: string,
        params?: AxiosRequestConfig<P>,
        config?: PureHttpRequestConfig
    ): Promise<T> {
        return this.request<T>("get", url, params, config);
    }
}

export const http = new PureHttp();
