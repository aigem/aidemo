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

// 批量添加应用
export async function onRequestPost({ request }) {
    try {
        const newApps: GradioApp[] = await request.json();
        const appsData: GradioApp[] = await eo_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 过滤掉已存在的应用
        const uniqueApps = newApps.filter(
            newApp => !appsData.some(app => app.directUrl === newApp.directUrl)
        );

        // 添加新应用
        appsData.push(...uniqueApps);
        await eo_kv.put(APPS_KEY, JSON.stringify(appsData));

        return createResponse(true, uniqueApps);
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