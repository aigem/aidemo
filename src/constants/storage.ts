export const STORAGE_KEYS = {
    APPS_INDEX: 'apps:index',        // 存储所有应用的 directUrl 列表
    APP_DETAIL: 'app:detail:',       // 前缀，存储应用详情
    CATEGORY_INDEX: 'apps:category:', // 前缀，存储分类索引
    METADATA: 'apps:metadata'        // 存储元数据
};

export const STORAGE_VERSION = '1.1.0';

export interface AppsMetadata {
    total: number;
    lastUpdate: number;
    version: string;
    categories: string[];
} 