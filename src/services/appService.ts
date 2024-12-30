import { apiClient } from '../utils/apiClient';
import { storageSync } from '../utils/storageSync';
import { featureManager } from '../config/features';

// 应用接口
export interface App {
  id: string;
  name: string;
  directUrl: string;
  category: string;
  description?: string;
  author?: {
    name: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// 分页结果接口
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 存储键类型
type StorageKey = `apps:list:${number}:${number}` | `app:${string}`;

// 应用服务类
class AppService {
  private static instance: AppService;

  private constructor() { }

  static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  // 获取应用列表
  async getApps(page = 1, pageSize = 10): Promise<PaginatedResult<App>> {
    try {
      // 检查是否启用了离线模式
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `apps:list:${page}:${pageSize}`;
        const cachedData = await storageSync.get(key);
        if (cachedData) {
          return cachedData as PaginatedResult<App>;
        }
      }

      const response = await apiClient.get<PaginatedResult<App>>('/apps', {
        params: { page, pageSize }
      });

      // 如果启用了离线模式,缓存数据
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `apps:list:${page}:${pageSize}`;
        await storageSync.set(key, response);
      }

      return response;
    } catch (error) {
      console.error('获取应用列表失败:', error);
      throw error;
    }
  }

  // 搜索应用
  async searchApps(query: string, page = 1, pageSize = 10): Promise<PaginatedResult<App>> {
    try {
      const response = await apiClient.get<PaginatedResult<App>>('/apps/search', {
        params: { query, page, pageSize }
      });
      return response;
    } catch (error) {
      console.error('搜索应用失败:', error);
      throw error;
    }
  }

  // 添加应用
  async addApp(app: Omit<App, 'id' | 'createdAt' | 'updatedAt'>): Promise<App> {
    try {
      const response = await apiClient.post<App>('/apps', app);

      // 如果启用了离线模式,缓存数据
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `app:${response.id}`;
        await storageSync.set(key, response);
      }

      return response;
    } catch (error) {
      console.error('添加应用失败:', error);
      throw error;
    }
  }

  // 更新应用
  async updateApp(id: string, app: Partial<Omit<App, 'id' | 'createdAt' | 'updatedAt'>>): Promise<App> {
    try {
      const response = await apiClient.put<App>(`/apps/${id}`, app);

      // 如果启用了离线模式,更新缓存
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `app:${id}`;
        await storageSync.set(key, response);
      }

      return response;
    } catch (error) {
      console.error('更新应用失败:', error);
      throw error;
    }
  }

  // 删除应用
  async deleteApp(id: string): Promise<void> {
    try {
      await apiClient.delete(`/apps/${id}`);

      // 如果启用了离线模式,删除缓存
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `app:${id}`;
        await storageSync.remove(key);
      }
    } catch (error) {
      console.error('删除应用失败:', error);
      throw error;
    }
  }

  // 获取应用详情
  async getAppById(id: string): Promise<App | null> {
    try {
      // 检查是否启用了离线模式
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `app:${id}`;
        const cachedData = await storageSync.get(key);
        if (cachedData) {
          return cachedData as App;
        }
      }

      const response = await apiClient.get<App>(`/apps/${id}`);

      // 如果启用了离线模式,缓存数据
      if (featureManager.isEnabled('enableOfflineMode')) {
        const key: StorageKey = `app:${id}`;
        await storageSync.set(key, response);
      }

      return response;
    } catch (error) {
      console.error('获取应用详情失败:', error);
      return null;
    }
  }

  // 获取应用统计信息
  async getAppStats(): Promise<{
    total: number;
    categories: Record<string, number>;
  }> {
    try {
      const response = await apiClient.get('/apps/stats');
      return response;
    } catch (error) {
      console.error('获取应用统计信息失败:', error);
      throw error;
    }
  }

  async importApps(apps: Omit<App, 'id'>[]): Promise<App[]> {
    const response = await apiClient.post<App[]>('/apps/import', { apps });
    return response;
  }

  async exportApps(): Promise<App[]> {
    const response = await apiClient.get<App[]>('/apps/export');
    return response;
  }
}

// 导出应用服务实例
export const appService = AppService.getInstance();