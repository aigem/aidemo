import type { GradioApp } from '../../../src/types/app';
import { nanoid } from 'nanoid';

const APPS_KEY = 'apps_data';
const APPS_STATS_KEY = 'apps_stats';
const APPS_STATUS_KEY = 'apps_status';
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
async function updateIndexes(app: GradioApp, isNew: boolean = true) {
    // 更新标签索引
    const tagsIndex = await my_kv.get(APPS_TAGS_INDEX_KEY, { type: 'json' }) || {};
    app.tags.forEach(tag => {
        tagsIndex[tag] = tagsIndex[tag] || [];
        if (isNew) {
            tagsIndex[tag].push(app.id);
        }
    });
    await my_kv.put(APPS_TAGS_INDEX_KEY, JSON.stringify(tagsIndex));

    // 更新作者索引
    if (app.author?.name) {
        const authorIndex = await my_kv.get(APPS_AUTHOR_INDEX_KEY, { type: 'json' }) || {};
        authorIndex[app.author.name] = authorIndex[app.author.name] || [];
        if (isNew) {
            authorIndex[app.author.name].push(app.id);
        }
        await my_kv.put(APPS_AUTHOR_INDEX_KEY, JSON.stringify(authorIndex));
    }

    // 更新分类索引
    const categoryIndex = await my_kv.get(APPS_CATEGORY_INDEX_KEY, { type: 'json' }) || {};
    categoryIndex[app.category] = categoryIndex[app.category] || [];
    if (isNew) {
        categoryIndex[app.category].push(app.id);
    }
    await my_kv.put(APPS_CATEGORY_INDEX_KEY, JSON.stringify(categoryIndex));

    // 更新置顶索引
    if (app.isTop) {
        const topIndex = await my_kv.get(APPS_TOP_INDEX_KEY, { type: 'json' }) || [];
        if (isNew && !topIndex.includes(app.id)) {
            topIndex.push(app.id);
            await my_kv.put(APPS_TOP_INDEX_KEY, JSON.stringify(topIndex));
        }
    }
}

// 更新统计信息
async function updateStats(app: GradioApp, isNew: boolean = true) {
    const stats = await my_kv.get(APPS_STATS_KEY, { type: 'json' }) || {
        totalApps: 0,
        totalViews: 0,
        totalLikes: 0,
        categoryStats: {},
        topApps: [],
        lastUpdated: Date.now()
    };

    if (isNew) {
        stats.totalApps++;
        stats.categoryStats[app.category] = (stats.categoryStats[app.category] || 0) + 1;
    }

    stats.lastUpdated = Date.now();
    await my_kv.put(APPS_STATS_KEY, JSON.stringify(stats));
}

// 获取所有应用
export async function onRequestGet({ request }) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const tag = url.searchParams.get('tag');
        const author = url.searchParams.get('author');
        const query = url.searchParams.get('q');
        const sort = url.searchParams.get('sort') || 'createdAt';
        const order = url.searchParams.get('order') || 'desc';
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');

        const appsData = await my_kv.get(APPS_KEY, { type: 'json' }) || { items: [] };
        let filteredApps = [...appsData.items];

        // 应用过滤
        if (category) {
            filteredApps = filteredApps.filter(app => app.category === category);
        }
        if (tag) {
            filteredApps = filteredApps.filter(app => app.tags.includes(tag));
        }
        if (author) {
            filteredApps = filteredApps.filter(app => app.author?.name === author);
        }
        if (query) {
            const searchQuery = query.toLowerCase();
            filteredApps = filteredApps.filter(app =>
                app.name.toLowerCase().includes(searchQuery) ||
                app.description.toLowerCase().includes(searchQuery) ||
                app.tags.some(tag => tag.toLowerCase().includes(searchQuery))
            );
        }

        // 排序
        filteredApps.sort((a, b) => {
            const aValue = a[sort];
            const bValue = b[sort];
            const modifier = order === 'desc' ? -1 : 1;
            return (aValue > bValue ? 1 : -1) * modifier;
        });

        // 分页
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedApps = filteredApps.slice(start, end);

        // 获取统计信息
        const stats = await my_kv.get(APPS_STATS_KEY, { type: 'json' });

        return createResponse(true, {
            items: paginatedApps,
            total: filteredApps.length,
            page,
            limit,
            stats
        });
    } catch (error) {
        console.error('获取应用列表失败:', error);
        return createResponse(false, null, '获取应用列表失败');
    }
}

// 添加新应用
export async function onRequestPost({ request }) {
    try {
        const app: Partial<GradioApp> = await request.json();
        const appsData = await my_kv.get(APPS_KEY, { type: 'json' }) || { items: [] };

        // 检查是否已存在
        if (appsData.items.some(a => a.directUrl === app.directUrl)) {
            return createResponse(false, null, '应用已存在');
        }

        // 补充必要字段
        const newApp: GradioApp = {
            ...app,
            id: nanoid(),
            viewCount: 0,
            likeCount: 0,
            status: 'active',
            tags: app.tags || [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        } as GradioApp;

        // 添加新应用
        appsData.items.push(newApp);
        appsData.lastUpdated = Date.now();
        await my_kv.put(APPS_KEY, JSON.stringify(appsData));

        // 更新索引和统计
        await updateIndexes(newApp);
        await updateStats(newApp);

        return createResponse(true, newApp);
    } catch (error) {
        console.error('添加应用失败:', error);
        return createResponse(false, null, '添加应用失败');
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