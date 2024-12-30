/// <reference types="vite/client" />

interface ImportMetaEnv {
    // API 配置
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_API_RETRIES: string;

    // 存储配置
    readonly VITE_STORAGE_VERSION: string;
    readonly VITE_STORAGE_PREFIX: string;
    readonly VITE_STORAGE_TTL: string;
    readonly VITE_STORAGE_QUOTA_WARNING: string;
    readonly VITE_STORAGE_QUOTA_ERROR: string;

    // 性能监控配置
    readonly VITE_PERFORMANCE_WARNING_THRESHOLD: string;
    readonly VITE_PERFORMANCE_ERROR_THRESHOLD: string;
    readonly VITE_PERFORMANCE_MAX_SAMPLES: string;
    readonly VITE_PERFORMANCE_METRICS_RETENTION: string;

    // 特性开关
    readonly VITE_ENABLE_OFFLINE_MODE: string;
    readonly VITE_ENABLE_DATA_COMPRESSION: string;
    readonly VITE_ENABLE_AUTO_SYNC: string;
    readonly VITE_ENABLE_PERFORMANCE_MONITORING: string;
    readonly VITE_ENABLE_ERROR_REPORTING: string;

    // 其他配置
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_DESCRIPTION: string;
    readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
} 