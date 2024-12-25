import { GradioApp } from '../types/app';
import { loadApps, saveApps } from '../utils/storage';
import { appsApi } from '../api/apps';

let isApiAvailable = true; // 默认启用 API

// Load apps with API fallback
export async function getApps(): Promise<GradioApp[]> {
  try {
    console.log('Attempting to fetch apps from API');
    const response = await appsApi.getApps();
    if (response?.data) {
      console.log('Successfully fetched apps from API:', response.data);
      // 更新本地存储作为备份
      saveApps(response.data);
      return response.data;
    }
  } catch (error) {
    console.error('API fetch failed:', error);
    isApiAvailable = false;
  }

  // 如果 API 失败，使用本地存储
  console.log('Using local storage data');
  return loadApps();
}

// Add new apps
export async function addApps(newApps: GradioApp[]): Promise<GradioApp[]> {
  console.log('Adding new apps:', newApps);

  try {
    if (isApiAvailable) {
      console.log('Attempting to sync with API');
      const response = await appsApi.importApps(newApps);
      if (response?.data) {
        console.log('Successfully synced with API:', response.data);
        saveApps(response.data);
        return response.data;
      }
    }
  } catch (error) {
    console.error('API sync failed:', error);
    isApiAvailable = false;
  }

  // 如果 API 失败，使用本地存储
  const currentApps = loadApps();
  const updatedApps = [...currentApps, ...newApps];
  saveApps(updatedApps);
  return updatedApps;
}

// Delete app
export async function deleteApp(directUrl: string): Promise<GradioApp[]> {
  console.log('Deleting app:', directUrl);

  try {
    if (isApiAvailable) {
      console.log('Attempting to sync deletion with API');
      await appsApi.deleteApp(directUrl);
      const response = await appsApi.getApps();
      if (response?.data) {
        console.log('Successfully synced deletion with API');
        saveApps(response.data);
        return response.data;
      }
    }
  } catch (error) {
    console.error('API sync failed:', error);
    isApiAvailable = false;
  }

  // 如果 API 失败，使用本地存储
  const currentApps = loadApps();
  const updatedApps = currentApps.filter(app => app.directUrl !== directUrl);
  saveApps(updatedApps);
  return updatedApps;
}

// Update app
export async function updateApp(updatedApp: GradioApp): Promise<GradioApp[]> {
  console.log('Updating app:', updatedApp);

  try {
    if (isApiAvailable) {
      console.log('Attempting to sync update with API');
      await appsApi.updateApp(updatedApp);
      const response = await appsApi.getApps();
      if (response?.data) {
        console.log('Successfully synced update with API');
        saveApps(response.data);
        return response.data;
      }
    }
  } catch (error) {
    console.error('API sync failed:', error);
    isApiAvailable = false;
  }

  // 如果 API 失败，使用本地存储
  const currentApps = loadApps();
  const updatedApps = currentApps.map(app =>
    app.directUrl === updatedApp.directUrl ? updatedApp : app
  );
  saveApps(updatedApps);
  return updatedApps;
}

// 检查 API 可用性
export async function checkApiAvailability(): Promise<boolean> {
  try {
    const response = await appsApi.getApps();
    isApiAvailable = response?.success === true;
    console.log('API availability check:', isApiAvailable);
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
  isApiAvailable = true; // 重置为启用状态
}