import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { configManager } from '../config';

// API错误类型
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// 重试配置接口
interface RetryConfig {
    retries: number;
    retryDelay: number;
    retryCondition?: (error: AxiosError) => boolean;
}

// API客户端类
export class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;
    private retryConfig: RetryConfig;

    private constructor() {
        const config = configManager.getConfig();

        // 创建axios实例
        this.axiosInstance = axios.create({
            baseURL: config.api.baseUrl,
            timeout: config.api.timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 设置重试配置
        this.retryConfig = {
            retries: config.api.retries,
            retryDelay: 1000,
            retryCondition: (error: AxiosError) => {
                // 只重试网络错误和5xx错误
                return !error.response || (error.response.status >= 500 && error.response.status <= 599);
            }
        };

        // 配置请求拦截器
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // 添加认证信息等
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 配置响应拦截器
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                return this.handleRequestError(error);
            }
        );
    }

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    // 处理请求错误
    private async handleRequestError(error: AxiosError): Promise<any> {
        const config = error.config as AxiosRequestConfig & { _retry?: number };

        // 如果没有配置重试次数,则直接抛出错误
        if (!config || !this.retryConfig.retryCondition?.(error)) {
            throw this.normalizeError(error);
        }

        // 初始化重试次数
        config._retry = config._retry || 0;

        // 如果还可以重试
        if (config._retry < this.retryConfig.retries) {
            config._retry++;

            // 等待延迟时间
            await new Promise(resolve =>
                setTimeout(resolve, this.retryConfig.retryDelay * config._retry)
            );

            // 重试请求
            return this.axiosInstance(config);
        }

        // 超过重试次数,抛出错误
        throw this.normalizeError(error);
    }

    // 标准化错误
    private normalizeError(error: AxiosError): ApiError {
        if (error.response) {
            // 服务器返回错误
            return new ApiError(
                error.response.data?.message || error.message,
                error.response.status,
                error.response.data?.code,
                error.response.data
            );
        } else if (error.request) {
            // 请求发送成功但没有收到响应
            return new ApiError(
                '服务器无响应',
                0,
                'NO_RESPONSE'
            );
        } else {
            // 请求配置出错
            return new ApiError(
                error.message,
                0,
                'REQUEST_FAILED'
            );
        }
    }

    // 发送GET请求
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 发送POST请求
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 发送PUT请求
    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 发送DELETE请求
    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // 发送批量请求
    async batch<T = any>(requests: AxiosRequestConfig[]): Promise<T[]> {
        try {
            const responses = await Promise.all(
                requests.map(config => this.axiosInstance(config))
            );
            return responses.map(response => response.data);
        } catch (error) {
            throw error;
        }
    }

    // 获取axios实例
    getAxiosInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    // 更新配置
    updateConfig(config: Partial<AxiosRequestConfig>): void {
        Object.assign(this.axiosInstance.defaults, config);
    }

    // 更新重试配置
    updateRetryConfig(config: Partial<RetryConfig>): void {
        Object.assign(this.retryConfig, config);
    }
}

// 导出API客户端实例
export const apiClient = ApiClient.getInstance(); 