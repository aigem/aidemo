import { appService, App } from './appService';
import { storageSync } from '../utils/storageSync';
import { featureManager } from '../config/features';
import { createValidationRules } from '../components/FormFeedback';

// 批量操作结果接口
interface BatchResult<T> {
    success: T[];
    failed: Array<{
        item: T;
        error: string;
    }>;
}

// 批量服务类
class BatchService {
    private static instance: BatchService;

    private constructor() { }

    static getInstance(): BatchService {
        if (!BatchService.instance) {
            BatchService.instance = new BatchService();
        }
        return BatchService.instance;
    }

    // 验证应用数据
    private validateApp(app: Partial<App>): string | null {
        try {
            // 验证必填字段
            if (!app.name?.trim()) {
                return '应用名称不能为空';
            }
            if (!app.directUrl?.trim()) {
                return '应用地址不能为空';
            }
            if (!app.category?.trim()) {
                return '应用类别不能为空';
            }

            // 验证字段长度
            if (app.name.length > 50) {
                return '应用名称不能超过50个字符';
            }
            if (app.description && app.description.length > 200) {
                return '应用描述不能超过200个字符';
            }

            // 验证URL格式
            try {
                new URL(app.directUrl);
            } catch {
                return '无效的应用地址URL';
            }

            return null;
        } catch (error) {
            return '数据验证失败';
        }
    }

    // 批量添加应用
    async batchAddApps(apps: Array<Omit<App, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BatchResult<App>> {
        const result: BatchResult<App> = {
            success: [],
            failed: []
        };

        for (const app of apps) {
            try {
                // 验证数据
                const error = this.validateApp(app);
                if (error) {
                    result.failed.push({ item: app as App, error });
                    continue;
                }

                // 添加应用
                const addedApp = await appService.addApp(app);
                result.success.push(addedApp);

                // 如果启用了离线模式,缓存数据
                if (featureManager.isEnabled('enableOfflineMode')) {
                    await storageSync.set(`app:${addedApp.id}`, addedApp);
                }
            } catch (error) {
                result.failed.push({
                    item: app as App,
                    error: error instanceof Error ? error.message : '添加失败'
                });
            }
        }

        return result;
    }

    // 批量更新应用
    async batchUpdateApps(apps: Array<App & { changes: Partial<Omit<App, 'id' | 'createdAt' | 'updatedAt'>> }>): Promise<BatchResult<App>> {
        const result: BatchResult<App> = {
            success: [],
            failed: []
        };

        for (const { id, changes } of apps) {
            try {
                // 验证更新数据
                const error = this.validateApp({ ...changes, id });
                if (error) {
                    result.failed.push({ item: { id, ...changes } as App, error });
                    continue;
                }

                // 更新应用
                const updatedApp = await appService.updateApp(id, changes);
                result.success.push(updatedApp);

                // 如果启用了离线模式,更新缓存
                if (featureManager.isEnabled('enableOfflineMode')) {
                    await storageSync.set(`app:${id}`, updatedApp);
                }
            } catch (error) {
                result.failed.push({
                    item: { id, ...changes } as App,
                    error: error instanceof Error ? error.message : '更新失败'
                });
            }
        }

        return result;
    }

    // 批量删除应用
    async batchDeleteApps(ids: string[]): Promise<BatchResult<string>> {
        const result: BatchResult<string> = {
            success: [],
            failed: []
        };

        for (const id of ids) {
            try {
                await appService.deleteApp(id);
                result.success.push(id);

                // 如果启用了离线模式,删除缓存
                if (featureManager.isEnabled('enableOfflineMode')) {
                    await storageSync.remove(`app:${id}`);
                }
            } catch (error) {
                result.failed.push({
                    item: id,
                    error: error instanceof Error ? error.message : '删除失败'
                });
            }
        }

        return result;
    }

    // 批量导入应用
    async importApps(data: string): Promise<BatchResult<App>> {
        try {
            // 解析CSV或JSON数据
            const apps = this.parseImportData(data);
            return this.batchAddApps(apps);
        } catch (error) {
            return {
                success: [],
                failed: [{
                    item: {} as App,
                    error: error instanceof Error ? error.message : '导入失败'
                }]
            };
        }
    }

    // 解析导入数据
    private parseImportData(data: string): Array<Omit<App, 'id' | 'createdAt' | 'updatedAt'>> {
        try {
            // 尝试解析为JSON
            return JSON.parse(data);
        } catch {
            // 如果不是JSON,尝试解析为CSV
            return this.parseCSV(data);
        }
    }

    // 解析CSV数据
    private parseCSV(csv: string): Array<Omit<App, 'id' | 'createdAt' | 'updatedAt'>> {
        const lines = csv.split('\n').map(line => line.trim()).filter(Boolean);
        if (lines.length === 0) {
            throw new Error('空的CSV数据');
        }

        // 解析头行
        const headers = lines[0].split(',').map(h => h.trim());
        const requiredFields = ['name', 'directUrl', 'category'];
        for (const field of requiredFields) {
            if (!headers.includes(field)) {
                throw new Error(`缺少必需字段: ${field}`);
            }
        }

        // 解析数据行
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const app: Record<string, string> = {};

            headers.forEach((header, index) => {
                app[header] = values[index] || '';
            });

            return app as Omit<App, 'id' | 'createdAt' | 'updatedAt'>;
        });
    }
}

// 导出批量服务实例
export const batchService = BatchService.getInstance(); 