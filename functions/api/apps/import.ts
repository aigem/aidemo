import type { GradioApp } from '../../../src/types/app';

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

// 导入应用
export async function onRequestPost({ request }) {
    try {
        const importedApps: GradioApp[] = await request.json();
        const currentApps: GradioApp[] = await eo_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 过滤掉已存在的应用
        const newApps = importedApps.filter(
            importedApp => !currentApps.some(app => app.directUrl === importedApp.directUrl)
        );

        // 合并应用列表
        const updatedApps = [...currentApps, ...newApps];
        await eo_kv.put(APPS_KEY, JSON.stringify(updatedApps));

        return createResponse(true, newApps);
    } catch (error) {
        console.error('导入应用失败:', error);
        return createResponse(false, null, '导入应用失败');
    }
}

// 导出应用
export async function onRequestGet() {
    try {
        const appsData = await eo_kv.get(APPS_KEY, { type: 'json' });
        return createResponse(true, appsData || []);
    } catch (error) {
        console.error('导出应用失败:', error);
        return createResponse(false, null, '导出应用失败');
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