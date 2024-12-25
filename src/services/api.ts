import type { GradioApp } from '../types/app';

const API_BASE_URL = '/api';

// API 响应类型
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// API 错误类
class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// 通用 API 请求函数
async function apiRequest<T>(
    endpoint: string,
    method: string = 'GET',
    body?: unknown
): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
        throw new ApiError(result.error || '操作失败');
    }

    return result.data as T;
}

// 获取所有应用
export async function fetchApps(): Promise<GradioApp[]> {
    return apiRequest<GradioApp[]>('/apps');
}

// 添加新应用
export async function addApp(app: GradioApp): Promise<GradioApp> {
    return apiRequest<GradioApp>('/apps', 'POST', app);
}

// 批量添加应用
export async function addApps(apps: GradioApp[]): Promise<GradioApp[]> {
    return apiRequest<GradioApp[]>('/apps/batch', 'POST', apps);
}

// 更新应用
export async function updateApp(app: GradioApp): Promise<GradioApp> {
    return apiRequest<GradioApp>(`/apps/${encodeURIComponent(app.directUrl)}`, 'PUT', app);
}

// 删除应用
export async function deleteApp(directUrl: string): Promise<void> {
    return apiRequest<void>(`/apps/${encodeURIComponent(directUrl)}`, 'DELETE');
}

// 导入应用
export async function importApps(apps: GradioApp[]): Promise<GradioApp[]> {
    return apiRequest<GradioApp[]>('/apps/import', 'POST', apps);
}

// 导出应用
export async function exportApps(): Promise<GradioApp[]> {
    return apiRequest<GradioApp[]>('/apps/export');
} 