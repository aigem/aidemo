import { AdminCredentials } from '../types/auth';
import { AUTH_CONFIG } from '../config/auth';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

export function login(credentials: AdminCredentials): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.username === AUTH_CONFIG.username && 
        credentials.password === AUTH_CONFIG.password
      ) {
        setStorageItem('AUTH', true);
        resolve(true);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
}

export function logout(): void {
  removeStorageItem('AUTH');
}

export function isAuthenticated(): boolean {
  return getStorageItem('AUTH') === true;
}