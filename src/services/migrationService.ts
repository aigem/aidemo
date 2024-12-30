import { App } from './appService';
import { storageSync } from '../utils/storageSync';
import { configManager } from '../config';

// 迁移版本接口
interface MigrationVersion {
    from: string;
    to: string;
    migrate: (data: any) => Promise<any>;
}

// 迁移服务类
class MigrationService {
    private static instance: MigrationService;
    private migrations: MigrationVersion[] = [];

    private constructor() {
        // 注册迁移版本
        this.registerMigrations();
    }

    static getInstance(): MigrationService {
        if (!MigrationService.instance) {
            MigrationService.instance = new MigrationService();
        }
        return MigrationService.instance;
    }

    // 注册迁移版本
    private registerMigrations() {
        // 从1.0.0到1.1.0的迁移
        this.migrations.push({
            from: '1.0.0',
            to: '1.1.0',
            migrate: async (data: any) => {
                // 添加新字段
                if (Array.isArray(data)) {
                    return data.map(item => ({
                        ...item,
                        createdAt: item.createdAt || new Date().toISOString(),
                        updatedAt: item.updatedAt || new Date().toISOString()
                    }));
                }
                return data;
            }
        });

        // 从1.1.0到1.2.0的迁移
        this.migrations.push({
            from: '1.1.0',
            to: '1.2.0',
            migrate: async (data: any) => {
                // 更新类别字段
                if (Array.isArray(data)) {
                    return data.map(item => ({
                        ...item,
                        category: item.category || '其他'
                    }));
                }
                return data;
            }
        });
    }

    // 获取迁移路径
    private getMigrationPath(fromVersion: string, toVersion: string): MigrationVersion[] {
        const path: MigrationVersion[] = [];
        let currentVersion = fromVersion;

        while (currentVersion !== toVersion) {
            const nextMigration = this.migrations.find(m => m.from === currentVersion);
            if (!nextMigration) {
                throw new Error(`找不到从 ${currentVersion} 的迁移路径`);
            }
            path.push(nextMigration);
            currentVersion = nextMigration.to;
        }

        return path;
    }

    // 检查是否需要迁移
    async checkMigration(): Promise<boolean> {
        const config = configManager.getConfig();
        const currentVersion = config.storage.version;
        const storedVersion = await this.getStoredVersion();

        return storedVersion !== currentVersion;
    }

    // 获取存储的版本
    private async getStoredVersion(): Promise<string> {
        try {
            const version = await storageSync.get('storage:version');
            return version || '1.0.0';
        } catch {
            return '1.0.0';
        }
    }

    // 执行迁移
    async migrate(): Promise<void> {
        const config = configManager.getConfig();
        const currentVersion = config.storage.version;
        const storedVersion = await this.getStoredVersion();

        if (storedVersion === currentVersion) {
            return;
        }

        try {
            // 获取所有应用数据
            const keys = await this.getAllStorageKeys();
            const apps: App[] = [];

            for (const key of keys) {
                if (key.startsWith('app:')) {
                    const app = await storageSync.get(key);
                    if (app) {
                        apps.push(app);
                    }
                }
            }

            // 获取迁移路径
            const migrationPath = this.getMigrationPath(storedVersion, currentVersion);

            // 执行迁移
            let migratedData = apps;
            for (const migration of migrationPath) {
                migratedData = await migration.migrate(migratedData);
            }

            // 保存迁移后的数据
            for (const app of migratedData) {
                await storageSync.set(`app:${app.id}`, app);
            }

            // 更新存储版本
            await storageSync.set('storage:version', currentVersion);
        } catch (error) {
            console.error('数据迁移失败:', error);
            throw error;
        }
    }

    // 获取所有存储键
    private async getAllStorageKeys(): Promise<string[]> {
        const keys: string[] = [];
        const config = configManager.getConfig();
        const prefix = config.storage.prefix;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keys.push(key);
            }
        }

        return keys;
    }

    // 备份数据
    async backup(): Promise<void> {
        try {
            const keys = await this.getAllStorageKeys();
            const backup: Record<string, any> = {
                version: await this.getStoredVersion(),
                timestamp: new Date().toISOString(),
                data: {}
            };

            for (const key of keys) {
                const value = await storageSync.get(key);
                if (value) {
                    backup.data[key] = value;
                }
            }

            // 保存备份
            const backupKey = `backup:${backup.timestamp}`;
            await storageSync.set(backupKey, backup);

            // 清理旧备份
            await this.cleanupBackups();
        } catch (error) {
            console.error('备份失败:', error);
            throw error;
        }
    }

    // 清理旧备份
    private async cleanupBackups(): Promise<void> {
        try {
            const keys = await this.getAllStorageKeys();
            const backupKeys = keys.filter(key => key.startsWith('backup:'));
            const config = configManager.getConfig();

            if (backupKeys.length > config.storage.maxBackups) {
                // 按时间排序
                backupKeys.sort();
                // 删除最旧的备份
                const keysToDelete = backupKeys.slice(0, backupKeys.length - config.storage.maxBackups);
                for (const key of keysToDelete) {
                    await storageSync.remove(key);
                }
            }
        } catch (error) {
            console.error('清理备份失败:', error);
        }
    }

    // 从备份恢复
    async restore(timestamp: string): Promise<void> {
        try {
            const backupKey = `backup:${timestamp}`;
            const backup = await storageSync.get(backupKey);

            if (!backup) {
                throw new Error('找不到指定的备份');
            }

            // 清除当前数据
            const keys = await this.getAllStorageKeys();
            for (const key of keys) {
                if (!key.startsWith('backup:')) {
                    await storageSync.remove(key);
                }
            }

            // 恢复数据
            for (const [key, value] of Object.entries(backup.data)) {
                await storageSync.set(key, value);
            }
        } catch (error) {
            console.error('恢复失败:', error);
            throw error;
        }
    }
}

// 导出迁移服务实例
export const migrationService = MigrationService.getInstance(); 