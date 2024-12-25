import { GradioApp } from '../types/app';
import * as api from '../api/apps';

// 缓存配置
const CACHE_TTL = 5 * 60 * 1000; // 缓存有效期：5分钟
let appsCache: GradioApp[] | null = null;
let lastFetchTime = 0;

// 检查缓存是否有效
function isCacheValid(): boolean {
  return !!(appsCache && (Date.now() - lastFetchTime < CACHE_TTL));
}

// 更新缓存
function updateCache(apps: GradioApp[]): void {
  appsCache = apps;
  lastFetchTime = Date.now();
}

// 清除缓存
function clearCache(): void {
  appsCache = null;
  lastFetchTime = 0;
}

// 获取所有应用
export async function getApps(): Promise<GradioApp[]> {
  try {
    // 如果缓存有效，直接返回缓存数据
    if (isCacheValid()) {
      console.log('使用缓存的应用数据');
      return appsCache!;
    }

    console.log('从 API 获取最新应用数据');
    const apps = await api.fetchApps();
    updateCache(apps);
    return apps;
  } catch (error) {
    console.error('获取应用失败:', error);
    // 如果 API 请求失败但有缓存，返回缓存数据
    if (appsCache) {
      console.warn('API 请求失败，使用缓存数据');
      return appsCache;
    }
    throw error;
  }
}

// 添加新应用
export async function addApp(app: GradioApp): Promise<GradioApp[]> {
  try {
    await api.addApp(app);
    clearCache(); // 清除缓存，强制下次获取最新数据
    return await getApps();
  } catch (error) {
    console.error('添加应用失败:', error);
    throw error;
  }
}

// 批量添加应用
export async function addApps(newApps: GradioApp[]): Promise<GradioApp[]> {
  try {
    await api.addApps(newApps);
    clearCache();
    return await getApps();
  } catch (error) {
    console.error('批量添加应用失败:', error);
    throw error;
  }
}

// 更新应用
export async function updateApp(app: GradioApp): Promise<GradioApp[]> {
  try {
    await api.updateApp(app);
    clearCache();
    return await getApps();
  } catch (error) {
    console.error('更新应用失败:', error);
    throw error;
  }
}

// 删除应用
export async function deleteApp(directUrl: string): Promise<GradioApp[]> {
  try {
    await api.deleteApp(directUrl);
    clearCache();
    return await getApps();
  } catch (error) {
    console.error('删除应用失败:', error);
    throw error;
  }
}

// 导入应用
export async function importApps(apps: GradioApp[]): Promise<GradioApp[]> {
  try {
    await api.importApps(apps);
    clearCache();
    return await getApps();
  } catch (error) {
    console.error('导入应用失败:', error);
    throw error;
  }
}

// 导出应用
export async function exportApps(): Promise<GradioApp[]> {
  try {
    return await api.exportApps();
  } catch (error) {
    console.error('导出应用失败:', error);
    throw error;
  }
}