import type { GradioApp } from '../types/app';

const API_BASE_URL = '/api';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1秒

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

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 通用 API 请求函数（带重试机制）
async function apiRequestWithRetry<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
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
    } catch (error) {
      lastError = error as Error;
      console.warn(`API 请求失败 (尝试 ${i + 1}/${retries}):`, error);

      if (i < retries - 1) {
        const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, i); // 指数退避
        console.log(`等待 ${retryDelay}ms 后重试...`);
        await delay(retryDelay);
      }
    }
  }

  throw lastError || new Error('未知错误');
}

// 获取所有应用
export async function fetchApps(): Promise<GradioApp[]> {
  return apiRequestWithRetry<GradioApp[]>('/apps');
}

// 添加新应用
export async function addApp(app: GradioApp): Promise<GradioApp> {
  return apiRequestWithRetry<GradioApp>('/apps', 'POST', app);
}

// 批量添加应用
export async function addApps(apps: GradioApp[]): Promise<GradioApp[]> {
  return apiRequestWithRetry<GradioApp[]>('/apps/batch', 'POST', apps);
}

// 更新应用
export async function updateApp(app: GradioApp): Promise<GradioApp> {
  return apiRequestWithRetry<GradioApp>(`/apps/${encodeURIComponent(app.directUrl)}`, 'PUT', app);
}

// 删除应用
export async function deleteApp(directUrl: string): Promise<void> {
  return apiRequestWithRetry<void>(`/apps/${encodeURIComponent(directUrl)}`, 'DELETE');
}

// 导入应用
export async function importApps(apps: GradioApp[]): Promise<GradioApp[]> {
  return apiRequestWithRetry<GradioApp[]>('/apps/import', 'POST', apps);
}

// 导出应用
export async function exportApps(): Promise<GradioApp[]> {
  return apiRequestWithRetry<GradioApp[]>('/apps/export');
}