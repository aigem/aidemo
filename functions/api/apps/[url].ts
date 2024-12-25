import type { GradioApp } from '../../../src/types/app';

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
async function updateIndexes(app: GradioApp, isDelete: boolean = false) {
    // 更新标签索引
    const tagsIndex = await my_kv.get(APPS_TAGS_INDEX_KEY, { type: 'json' }) || {};
    app.tags.forEach(tag => {
        tagsIndex[tag] = tagsIndex[tag] || [];
        if (isDelete) {
            tagsIndex[tag] = tagsIndex[tag].filter(id => id !== app.id);
        } else if (!tagsIndex[tag].includes(app.id)) {
            tagsIndex[tag].push(app.id);
        }
    });
    await my_kv.put(APPS_TAGS_INDEX_KEY, JSON.stringify(tagsIndex));

    // 更新作者索引
    if (app.author?.name) {
        const authorIndex = await my_kv.get(APPS_AUTHOR_INDEX_KEY, { type: 'json' }) || {};
        authorIndex[app.author.name] = authorIndex[app.author.name] || [];
        if (isDelete) {
            authorIndex[app.author.name] = authorIndex[app.author.name].filter(id => id !== app.id);
        } else if (!authorIndex[app.author.name].includes(app.id)) {
            authorIndex[app.author.name].push(app.id);
        }
        await my_kv.put(APPS_AUTHOR_INDEX_KEY, JSON.stringify(authorIndex));
    }

    // 更新分类索引
    const categoryIndex = await my_kv.get(APPS_CATEGORY_INDEX_KEY, { type: 'json' }) || {};
    categoryIndex[app.category] = categoryIndex[app.category] || [];
    if (isDelete) {
        categoryIndex[app.category] = categoryIndex[app.category].filter(id => id !== app.id);
    } else if (!categoryIndex[app.category].includes(app.id)) {
        categoryIndex[app.category].push(app.id);
    }
    await my_kv.put(APPS_CATEGORY_INDEX_KEY, JSON.stringify(categoryIndex));

    // 更新置顶索引
    const topIndex = await my_kv.get(APPS_TOP_INDEX_KEY, { type: 'json' }) || [];
    if (isDelete) {
        const newTopIndex = topIndex.filter(id => id !== app.id);
        await my_kv.put(APPS_TOP_INDEX_KEY, JSON.stringify(newTopIndex));
    } else if (app.isTop && !topIndex.includes(app.id)) {
        topIndex.push(app.id);
        await my_kv.put(APPS_TOP_INDEX_KEY, JSON.stringify(topIndex));
    }
}

// 更新统计信息
async function updateStats(app: GradioApp, isDelete: boolean = false) {
    const stats = await my_kv.get(APPS_STATS_KEY, { type: 'json' }) || {
        totalApps: 0,
        totalViews: 0,
        totalLikes: 0,
        categoryStats: {},
        topApps: [],
        lastUpdated: Date.now()
    };

    if (isDelete) {
        stats.totalApps--;
        stats.categoryStats[app.category]--;
    }

    stats.lastUpdated = Date.now();
    await my_kv.put(APPS_STATS_KEY, JSON.stringify(stats));
}

// 获取单个应用
export async function onRequestGet({ params }) {
    try {
        const { url } = params;
        const appsData = await my_kv.get(APPS_KEY, { type: 'json' }) || { items: [] };
        const app = appsData.items.find(a => a.directUrl === url);

        if (!app) {
            return createResponse(false, null, '应用不存在');
        }

        // 更新浏览数
        app.viewCount = (app.viewCount || 0) + 1;
        app.updatedAt = Date.now();
        await my_kv.put(APPS_KEY, JSON.stringify(appsData));

        return createResponse(true, app);
    } catch (error) {
        console.error('获取应用失败:', error);
        return createResponse(false, null, '获取应用失败');
    }
}

// 更新单个应用
export async function onRequestPut({ request, params }) {
    try {
        const { url } = params;
        const updateData: Partial<GradioApp> = await request.json();
        const appsData = await my_kv.get(APPS_KEY, { type: 'json' }) || { items: [] };
        const appIndex = appsData.items.findIndex(a => a.directUrl === url);

        if (appIndex === -1) {
            return createResponse(false, null, '应用不存在');
        }

        // 更新应用数据
        const updatedApp: GradioApp = {
            ...appsData.items[appIndex],
            ...updateData,
            updatedAt: Date.now()
        };
        appsData.items[appIndex] = updatedApp;
        appsData.lastUpdated = Date.now();
        await my_kv.put(APPS_KEY, JSON.stringify(appsData));

        // 更新索引
        await updateIndexes(updatedApp);

        return createResponse(true, updatedApp);
    } catch (error) {
        console.error('更新应用失败:', error);
        return createResponse(false, null, '更新应用失败');
    }
}

// 删除单个应用
export async function onRequestDelete({ params }) {
    try {
        const { url } = params;
        const appsData = await my_kv.get(APPS_KEY, { type: 'json' }) || { items: [] };
        const appIndex = appsData.items.findIndex(a => a.directUrl === url);

        if (appIndex === -1) {
            return createResponse(false, null, '应用不存在');
        }

        // 保存要删除的应用信息用于更新索引
        const deletedApp = appsData.items[appIndex];

        // 删除应用
        appsData.items.splice(appIndex, 1);
        appsData.lastUpdated = Date.now();
        await my_kv.put(APPS_KEY, JSON.stringify(appsData));

        // 更新索引和统计
        await updateIndexes(deletedApp, true);
        await updateStats(deletedApp, true);

        return createResponse(true, null);
    } catch (error) {
        console.error('删除应用失败:', error);
        return createResponse(false, null, '删除应用失败');
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