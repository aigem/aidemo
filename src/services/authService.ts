import { AdminCredentials } from '../types/auth';
import { AUTH_CONFIG } from '../config/auth';

const TOKEN_KEY = 'auth_token';

// 从 sessionStorage 中获取 token（仅会话期间有效）
function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

// 保存 token 到 sessionStorage（仅会话期间有效）
function setAuthToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

// 移除 token
function removeAuthToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function login(credentials: AdminCredentials): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // 验证凭据
    if (
      credentials.username === AUTH_CONFIG.username &&
      credentials.password === AUTH_CONFIG.password
    ) {
      // 生成一个简单的会话 token
      const token = btoa(`${credentials.username}:${Date.now()}`);
      setAuthToken(token);
      resolve(true);
    } else {
      reject(new Error('用户名或密码错误'));
    }
  });
}

export function logout(): void {
  removeAuthToken();
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}