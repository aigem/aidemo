import { merge } from 'lodash';

// 环境类型
export type Environment = 'development' | 'production' | 'test';

// 基础配置接口
export interface BaseConfig {
    api: {
        baseUrl: string;
        timeout: number;
        retries: number;
    };
    storage: {
        version: string;
        prefix: string;
        ttl: number;
        quotaWarning: number;
        quotaError: number;
        backupInterval: number;
        maxBackups: number;
    };
    performance: {
        warningThreshold: number;
        errorThreshold: number;
        maxSampleSize: number;
        metricsRetention: number;
    };
    features: {
        enableOfflineMode: boolean;
        enableDataCompression: boolean;
        enableAutoSync: boolean;
        enablePerformanceMonitoring: boolean;
        enableErrorReporting: boolean;
    };
}

// 默认配置
const defaultConfig: BaseConfig = {
    api: {
        baseUrl: '/api',
        timeout: 10000,
        retries: 3
    },
    storage: {
        version: '1.0',
        prefix: 'demoai:',
        ttl: 300000, // 5分钟
        quotaWarning: 80,
        quotaError: 90,
        backupInterval: 3600000, // 1小时
        maxBackups: 5
    },
    performance: {
        warningThreshold: 1000,
        errorThreshold: 3000,
        maxSampleSize: 100,
        metricsRetention: 86400000 // 24小时
    },
    features: {
        enableOfflineMode: true,
        enableDataCompression: true,
        enableAutoSync: true,
        enablePerformanceMonitoring: true,
        enableErrorReporting: true
    }
};

// 环境特定配置
const envConfigs: Record<Environment, Partial<BaseConfig>> = {
    development: {
        api: {
            baseUrl: 'http://localhost:3000/api'
        },
        features: {
            enablePerformanceMonitoring: false,
            enableErrorReporting: false
        }
    },
    test: {
        api: {
            baseUrl: 'http://test-api.example.com/api'
        },
        storage: {
            prefix: 'demoai:test:'
        }
    },
    production: {
        api: {
            baseUrl: 'https://api.example.com/api'
        }
    }
};

// 配置管理类
export class ConfigManager {
    private static instance: ConfigManager;
    private currentConfig: BaseConfig;
    private environment: Environment;

    private constructor() {
        this.environment = this.detectEnvironment();
        this.currentConfig = this.loadConfig();
    }

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    // 获取当前环境
    private detectEnvironment(): Environment {
        const env = process.env.NODE_ENV as Environment;
        return env || 'development';
    }

    // 加载配置
    private loadConfig(): BaseConfig {
        // 合并默认配置和环境配置
        const envConfig = envConfigs[this.environment] || {};
        const config = merge({}, defaultConfig, envConfig);

        // 应用环境变量覆盖
        this.applyEnvironmentOverrides(config);

        return config;
    }

    // 应用环境变量覆盖
    private applyEnvironmentOverrides(config: BaseConfig): void {
        // API 配置
        if (process.env.VITE_API_BASE_URL) {
            config.api.baseUrl = process.env.VITE_API_BASE_URL;
        }
        if (process.env.VITE_API_TIMEOUT) {
            config.api.timeout = parseInt(process.env.VITE_API_TIMEOUT, 10);
        }

        // 存储配置
        if (process.env.VITE_STORAGE_VERSION) {
            config.storage.version = process.env.VITE_STORAGE_VERSION;
        }
        if (process.env.VITE_STORAGE_PREFIX) {
            config.storage.prefix = process.env.VITE_STORAGE_PREFIX;
        }

        // 特性开关
        if (process.env.VITE_ENABLE_OFFLINE_MODE) {
            config.features.enableOfflineMode = process.env.VITE_ENABLE_OFFLINE_MODE === 'true';
        }
        if (process.env.VITE_ENABLE_DATA_COMPRESSION) {
            config.features.enableDataCompression = process.env.VITE_ENABLE_DATA_COMPRESSION === 'true';
        }
    }

    // 获取完整配置
    getConfig(): BaseConfig {
        return this.currentConfig;
    }

    // 获取特定配置项
    get<K extends keyof BaseConfig>(key: K): BaseConfig[K] {
        return this.currentConfig[key];
    }

    // 获取当前环境
    getEnvironment(): Environment {
        return this.environment;
    }

    // 检查特性是否启用
    isFeatureEnabled(feature: keyof BaseConfig['features']): boolean {
        return this.currentConfig.features[feature];
    }

    // 更新配置（仅用于测试）
    updateConfig(newConfig: Partial<BaseConfig>): void {
        if (this.environment !== 'test') {
            throw new Error('配置只能在测试环境中更新');
        }
        this.currentConfig = merge({}, this.currentConfig, newConfig);
    }
}

// 导出配置管理器实例
export const configManager = ConfigManager.getInstance(); 