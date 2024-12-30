import { configManager } from '../config';
import { featureManager } from '../config/features';
import { apiClient } from './apiClient';

// 同步状态类型
export type SyncStatus = 'idle' | 'syncing' | 'error';

// 同步项接口
interface SyncItem {
    key: string;
    value: any;
    timestamp: number;
    version: string;
}

// 同步管理器类
export class StorageSync {
    private static instance: StorageSync;
    private syncStatus: SyncStatus = 'idle';
    private syncQueue: Set<string> = new Set();
    private syncInterval: number | null = null;

    private constructor() {
        // 初始化同步
        this.initialize();
    }

    static getInstance(): StorageSync {
        if (!StorageSync.instance) {
            StorageSync.instance = new StorageSync();
        }
        return StorageSync.instance;
    }

    // 初始化
    private async initialize(): Promise<void> {
        // 检查是否启用了自动同步
        if (featureManager.isEnabled('enableAutoSync')) {
            const config = configManager.getConfig();
            // 设置定时同步
            this.startAutoSync(config.storage.backupInterval);
        }

        // 加载离线数据
        if (featureManager.isEnabled('enableOfflineMode')) {
            await this.loadOfflineData();
        }
    }

    // 开始自动同步
    private startAutoSync(interval: number): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = window.setInterval(() => {
            this.sync().catch(console.error);
        }, interval);
    }

    // 停止自动同步
    private stopAutoSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // 加载离线数据
    private async loadOfflineData(): Promise<void> {
        try {
            // 获取所有存储的键
            const keys = await this.getAllStorageKeys();

            // 加载每个键的数据
            for (const key of keys) {
                const item = await this.getStorageItem(key);
                if (item && this.isItemValid(item)) {
                    // 将数据添加到同步队列
                    this.syncQueue.add(key);
                }
            }
        } catch (error) {
            console.error('加载离线数据失败:', error);
        }
    }

    // 获取所有存储的键
    private async getAllStorageKeys(): Promise<string[]> {
        const config = configManager.getConfig();
        const prefix = config.storage.prefix;
        const keys: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keys.push(key);
            }
        }

        return keys;
    }

    // 获取存储项
    private async getStorageItem(key: string): Promise<SyncItem | null> {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error(`获取存储项失败 ${key}:`, error);
        }
        return null;
    }

    // 设置存储项
    private async setStorageItem(key: string, value: any): Promise<void> {
        const config = configManager.getConfig();
        const item: SyncItem = {
            key,
            value,
            timestamp: Date.now(),
            version: config.storage.version
        };

        try {
            localStorage.setItem(key, JSON.stringify(item));
            this.syncQueue.add(key);
        } catch (error) {
            console.error(`设置存储项失败 ${key}:`, error);
            throw error;
        }
    }

    // 验证存储项是否有效
    private isItemValid(item: SyncItem): boolean {
        const config = configManager.getConfig();
        const now = Date.now();
        const age = now - item.timestamp;

        // 检查版本
        if (item.version !== config.storage.version) {
            return false;
        }

        // 检查TTL
        if (age > config.storage.ttl) {
            return false;
        }

        return true;
    }

    // 同步数据
    async sync(): Promise<void> {
        // 如果已经在同步中或没有需要同步的数据,则返回
        if (this.syncStatus === 'syncing' || this.syncQueue.size === 0) {
            return;
        }

        try {
            this.syncStatus = 'syncing';

            // 获取需要同步的项
            const keys = Array.from(this.syncQueue);
            const items: SyncItem[] = [];

            // 收集同步数据
            for (const key of keys) {
                const item = await this.getStorageItem(key);
                if (item && this.isItemValid(item)) {
                    items.push(item);
                }
                this.syncQueue.delete(key);
            }

            if (items.length > 0) {
                // 发送同步请求
                await apiClient.post('/sync', { items });
            }

            this.syncStatus = 'idle';
        } catch (error) {
            this.syncStatus = 'error';
            console.error('同步失败:', error);
            throw error;
        }
    }

    // 获取同步状态
    getSyncStatus(): SyncStatus {
        return this.syncStatus;
    }

    // 手动触发同步
    async forceSyncNow(): Promise<void> {
        await this.sync();
    }

    // 添加数据到存储
    async set(key: string, value: any): Promise<void> {
        await this.setStorageItem(key, value);

        // 如果启用了自动同步,立即触发同步
        if (featureManager.isEnabled('enableAutoSync')) {
            this.sync().catch(console.error);
        }
    }

    // 获取数据
    async get(key: string): Promise<any | null> {
        const item = await this.getStorageItem(key);
        if (item && this.isItemValid(item)) {
            return item.value;
        }
        return null;
    }

    // 删除数据
    async remove(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
            // 如果在同步队列中,也需要移除
            this.syncQueue.delete(key);
        } catch (error) {
            console.error(`删除存储项失败 ${key}:`, error);
            throw error;
        }
    }

    // 清理过期数据
    async cleanup(): Promise<void> {
        try {
            const keys = await this.getAllStorageKeys();
            for (const key of keys) {
                const item = await this.getStorageItem(key);
                if (!item || !this.isItemValid(item)) {
                    await this.remove(key);
                }
            }
        } catch (error) {
            console.error('清理过期数据失败:', error);
            throw error;
        }
    }
}

// 导出存储同步管理器实例
export const storageSync = StorageSync.getInstance(); 