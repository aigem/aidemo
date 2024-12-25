import type { GradioApp } from '../types/app';

const API_BASE_URL = '/api';
const APPS_KEY = 'gradio_apps';

// API 响应类型
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// 获取所有应用
export async function fetchApps(): Promise<GradioApp[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/apps`);
        const result: ApiResponse<GradioApp[]> = await response.json();
        if (!result.success) {
            throw new Error(result.error || '获取应用列表失败');
        }
        return result.data || [];
    } catch (error) {
        console.error('获取应用列表失败:', error);
        // 如果 API 调用失败，尝试从本地存储获取
        const localApps = localStorage.getItem(APPS_KEY);
        return localApps ? JSON.parse(localApps) : [];
    }
}

// 保存所有应用
export async function saveAllApps(apps: GradioApp[]): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/apps`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apps),
        });
        const result: ApiResponse<void> = await response.json();
        if (!result.success) {
            throw new Error(result.error || '保存应用列表失败');
        }
        // 同时更新本地存储
        localStorage.setItem(APPS_KEY, JSON.stringify(apps));
    } catch (error) {
        console.error('保存应用列表失败:', error);
        // 如果 API 调用失败，只保存到本地存储
        localStorage.setItem(APPS_KEY, JSON.stringify(apps));
    }
}

// 添加单个应用
export async function addApp(app: GradioApp): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/apps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(app),
        });
        const result: ApiResponse<void> = await response.json();
        if (!result.success) {
            throw new Error(result.error || '添加应用失败');
        }
    } catch (error) {
        console.error('添加应用失败:', error);
        throw error;
    }
}

// 更新单个应用
export async function updateApp(app: GradioApp): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/apps/${encodeURIComponent(app.directUrl)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(app),
        });
        const result: ApiResponse<void> = await response.json();
        if (!result.success) {
            throw new Error(result.error || '更新应用失败');
        }
    } catch (error) {
        console.error('更新应用失败:', error);
        throw error;
    }
}

// 删除单个应用
export async function deleteApp(directUrl: string): Promise<void> {
    try {
        const response = await fetch(`${API_BASE_URL}/apps/${encodeURIComponent(directUrl)}`, {
            method: 'DELETE',
        });
        const result: ApiResponse<void> = await response.json();
        if (!result.success) {
            throw new Error(result.error || '删除应用失败');
        }
    } catch (error) {
        console.error('删除应用失败:', error);
        throw error;
    }
} 