import type { GradioApp } from '../../src/types/app';

const APPS_KEY = 'apps_data';

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

// 获取所有应用
export async function onRequestGet() {
    try {
        const appsData = await my_kv.get(APPS_KEY, { type: 'json' });
        return createResponse(true, appsData || []);
    } catch (error) {
        console.error('获取应用列表失败:', error);
        return createResponse(false, null, '获取应用列表失败');
    }
}

// 添加新应用
export async function onRequestPost({ request }) {
    try {
        const app: GradioApp = await request.json();
        const appsData: GradioApp[] = await my_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 检查是否已存在
        if (appsData.some(a => a.directUrl === app.directUrl)) {
            return createResponse(false, null, '应用已存在');
        }

        // 添加新应用
        appsData.push(app);
        await my_kv.put(APPS_KEY, JSON.stringify(appsData));

        return createResponse(true, app);
    } catch (error) {
        console.error('添加应用失败:', error);
        return createResponse(false, null, '添加应用失败');
    }
}

// 更新应用列表
export async function onRequestPut({ request }) {
    try {
        const apps: GradioApp[] = await request.json();
        await my_kv.put(APPS_KEY, JSON.stringify(apps));
        return createResponse(true);
    } catch (error) {
        console.error('更新应用列表失败:', error);
        return createResponse(false, null, '更新应用列表失败');
    }
}

// 删除应用
export async function onRequestDelete({ request }) {
    try {
        const url = new URL(request.url);
        const directUrl = decodeURIComponent(url.pathname.split('/').pop() || '');

        // 获取当前应用列表
        const appsData: GradioApp[] = await my_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 过滤掉要删除的应用
        const newApps = appsData.filter(a => a.directUrl !== directUrl);

        // 如果没有变化，说明应用不存在
        if (newApps.length === appsData.length) {
            return createResponse(false, null, '应用不存在');
        }

        // 保存更新后的列表
        await my_kv.put(APPS_KEY, JSON.stringify(newApps));
        return createResponse(true);
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