import type { GradioApp } from '../types/app';

const STORAGE_KEYS = {
  AUTH: 'isAuthenticated',
  APPS: 'gradioApps'
} as const;

// 通用存储函数
export function getStorageItem<T>(key: keyof typeof STORAGE_KEYS): T | null {
  try {
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
}

export function setStorageItem(key: keyof typeof STORAGE_KEYS, value: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
}

export function removeStorageItem(key: keyof typeof STORAGE_KEYS): void {
  try {
    localStorage.removeItem(STORAGE_KEYS[key]);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
}

// App-specific storage functions
export function loadApps(): GradioApp[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.APPS);
    console.log('Raw stored data:', storedData);

    if (!storedData) {
      console.log('No data found in storage');
      return [];
    }

    const apps = JSON.parse(storedData) as GradioApp[];
    console.log('Parsed apps from storage:', apps);
    return Array.isArray(apps) ? apps : [];
  } catch (error) {
    console.error('Error loading apps from storage:', error);
    return [];
  }
}

export function saveApps(apps: GradioApp[]): void {
  try {
    if (!Array.isArray(apps)) {
      console.error('Invalid apps data:', apps);
      return;
    }

    const dataToSave = JSON.stringify(apps);
    console.log('Saving data to storage:', dataToSave);

    localStorage.setItem(STORAGE_KEYS.APPS, dataToSave);

    // 验证保存
    const savedData = localStorage.getItem(STORAGE_KEYS.APPS);
    console.log('Verified saved data:', savedData);

    if (savedData !== dataToSave) {
      console.error('Storage verification failed');
    }
  } catch (error) {
    console.error('Error saving apps to storage:', error);
  }
}

// Auth storage helpers
export function setAuthenticated(value: boolean): void {
  setStorageItem('AUTH', value);
}

export function isAuthenticated(): boolean {
  return getStorageItem('AUTH') === true;
}