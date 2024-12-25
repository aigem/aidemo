import { GradioApp } from '../types/app';
import { loadApps, saveApps } from '../utils/storage';
import { appsApi } from '../api/apps';

let isApiAvailable = false; // 默认使用本地存储

// Load apps with API fallback
export async function getApps(): Promise<GradioApp[]> {
  // 首先尝试从本地存储加载
  const localApps = loadApps();

  if (!isApiAvailable) {
    console.log('API not available, using local storage data');
    return localApps;
  }

  try {
    console.log('Attempting to fetch apps from API');
    const response = await appsApi.getApps();
    if (response?.data) {
      console.log('Successfully fetched apps from API:', response.data);
      // 只有当 API 返回有效数据时才更新本地存储
      saveApps(response.data);
      return response.data;
    } else {
      console.warn('API returned no data, using local storage');
      return localApps;
    }
  } catch (error) {
    console.error('API fetch failed:', error);
    console.warn('Using local storage data');
    isApiAvailable = false;
    return localApps;
  }
}

// Add new apps
export async function addApps(newApps: GradioApp[]): Promise<GradioApp[]> {
  console.log('Adding new apps:', newApps);

  // 首先更新本地存储
  const currentApps = loadApps();
  const updatedApps = [...currentApps, ...newApps];
  saveApps(updatedApps);

  if (!isApiAvailable) {
    console.log('API not available, using local storage only');
    return updatedApps;
  }

  try {
    console.log('Attempting to sync with API');
    const response = await appsApi.importApps(newApps);
    if (response?.data) {
      console.log('Successfully synced with API:', response.data);
      saveApps(response.data);
      return response.data;
    }
  } catch (error) {
    console.error('API sync failed:', error);
    isApiAvailable = false;
  }

  return updatedApps;
}

// Delete app
export async function deleteApp(directUrl: string): Promise<GradioApp[]> {
  console.log('Deleting app:', directUrl);

  // 首先从本地存储删除
  const currentApps = loadApps();
  const updatedApps = currentApps.filter(app => app.directUrl !== directUrl);
  saveApps(updatedApps);

  if (!isApiAvailable) {
    console.log('API not available, using local storage only');
    return updatedApps;
  }

  try {
    console.log('Attempting to sync deletion with API');
    await appsApi.deleteApp(directUrl);
    const response = await appsApi.getApps();
    if (response?.data) {
      console.log('Successfully synced deletion with API');
      saveApps(response.data);
      return response.data;
    }
  } catch (error) {
    console.error('API sync failed:', error);
    isApiAvailable = false;
  }

  return updatedApps;
}

// Update app
export async function updateApp(updatedApp: GradioApp): Promise<GradioApp[]> {
  console.log('Updating app:', updatedApp);

  // 首先更新本地存储
  const currentApps = loadApps();
  const updatedApps = currentApps.map(app =>
    app.directUrl === updatedApp.directUrl ? updatedApp : app
  );
  saveApps(updatedApps);

  if (!isApiAvailable) {
    console.log('API not available, using local storage only');
    return updatedApps;
  }

  try {
    console.log('Attempting to sync update with API');
    await appsApi.updateApp(updatedApp);
    const response = await appsApi.getApps();
    if (response?.data) {
      console.log('Successfully synced update with API');
      saveApps(response.data);
      return response.data;
    }
  } catch (error) {
    console.error('API sync failed:', error);
    isApiAvailable = false;
  }

  return updatedApps;
}

// 检查 API 可用性
export async function checkApiAvailability(): Promise<boolean> {
  try {
    const response = await appsApi.getApps();
    isApiAvailable = !!response?.data;
    return isApiAvailable;
  } catch (error) {
    console.error('API availability check failed:', error);
    isApiAvailable = false;
    return false;
  }
}

// 重置 API 可用状态
export function resetApiAvailability(): void {
  console.log('Resetting API availability');
  isApiAvailable = false; // 默认使用本地存储，直到 API 可用性被确认
}