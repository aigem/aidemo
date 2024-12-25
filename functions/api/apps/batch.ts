import type { GradioApp } from '../../../src/types/app';
import { nanoid } from 'nanoid';

const APPS_KEY = 'apps_data';
const APPS_STATS_KEY = 'apps_stats';
const APPS_TAGS_INDEX_KEY = 'apps_tags_index';
const APPS_AUTHOR_INDEX_KEY = 'apps_author_index';
const APPS_TOP_INDEX_KEY = 'apps_top_index';
const APPS_CATEGORY_INDEX_KEY = 'apps_category_index';

// 统一的响应格式
function createResponse(success: boolean, data?: any, error?: string) {
    return new Response(JSON.stringify({ success, data, error }), {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'no-cache'
        },
    });
}

// 更新索引
async function updateIndexes(apps: GradioApp[]) {
    // 更新标签索引
    const tagsIndex = await my_kv.get(APPS_TAGS_INDEX_KEY, { type: 'json' }) || {};
    apps.forEach(app => {
        app.tags.forEach(tag => {
            tagsIndex[tag] = tagsIndex[tag] || [];
            if (!tagsIndex[tag].includes(app.id)) {
                tagsIndex[tag].push(app.id);
            }
        });
    });
    await my_kv.put(APPS_TAGS_INDEX_KEY, JSON.stringify(tagsIndex));

    // 更新作者索引
    const authorIndex = await my_kv.get(APPS_AUTHOR_INDEX_KEY, { type: 'json' }) || {};
    apps.forEach(app => {
        if (app.author?.name) {
            authorIndex[app.author.name] = authorIndex[app.author.name] || [];
            if (!authorIndex[app.author.name].includes(app.id)) {
                authorIndex[app.author.name].push(app.id);
            }
        }
    });
    await my_kv.put(APPS_AUTHOR_INDEX_KEY, JSON.stringify(authorIndex));

    // 更新分类索引
    const categoryIndex = await my_kv.get(APPS_CATEGORY_INDEX_KEY, { type: 'json' }) || {};
    apps.forEach(app => {
        categoryIndex[app.category] = categoryIndex[app.category] || [];
        if (!categoryIndex[app.category].includes(app.id)) {
            categoryIndex[app.category].push(app.id);
        }
    });
    await my_kv.put(APPS_CATEGORY_INDEX_KEY, JSON.stringify(categoryIndex));

    // 更新置顶索引
    const topIndex = await my_kv.get(APPS_TOP_INDEX_KEY, { type: 'json' }) || [];
    apps.forEach(app => {
        if (app.isTop && !topIndex.includes(app.id)) {
            topIndex.push(app.id);
        }
    });
    await my_kv.put(APPS_TOP_INDEX_KEY, JSON.stringify(topIndex));
}

// 更新统计信息
async function updateStats(newAppsCount: number) {
    const stats = await my_kv.get(APPS_STATS_KEY, { type: 'json' }) || {
        totalApps: 0,
        totalViews: 0,
        totalLikes: 0,
        categoryStats: {},
        topApps: [],
        lastUpdated: Date.now()
    };

    stats.totalApps += newAppsCount;
    stats.lastUpdated = Date.now();
    await my_kv.put(APPS_STATS_KEY, JSON.stringify(stats));
}

// 批量添加应用
export async function onRequestPost({ request }) {
    try {
        const newApps: Partial<GradioApp>[] = await request.json();
        const appsData = await my_kv.get(APPS_KEY, { type: 'json' }) || { items: [] };

        // 过滤掉已存在的应用
        const uniqueApps = newApps.filter(
            newApp => !appsData.items.some(app => app.directUrl === newApp.directUrl)
        );

        // 补充必要字段
        const processedApps: GradioApp[] = uniqueApps.map(app => ({
            ...app,
            id: nanoid(),
            viewCount: 0,
            likeCount: 0,
            status: 'active',
            tags: app.tags || [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        })) as GradioApp[];

        // 添加新应用
        appsData.items.push(...processedApps);
        appsData.lastUpdated = Date.now();
        await my_kv.put(APPS_KEY, JSON.stringify(appsData));

        // 更新索引和统计
        await updateIndexes(processedApps);
        await updateStats(processedApps.length);

        return createResponse(true, processedApps);
    } catch (error) {
        console.error('批量添加应用失败:', error);
        return createResponse(false, null, '批量添加应用失败');
    }
}

// 处理 OPTIONS 请求
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
} 