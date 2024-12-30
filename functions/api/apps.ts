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
        const appsData = await eo_kv.get(APPS_KEY, { type: 'json' });
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
        const appsData: GradioApp[] = await eo_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 检查是否已存在
        if (appsData.some(a => a.directUrl === app.directUrl)) {
            return createResponse(false, null, '应用已存在');
        }

        // 添加新应用
        appsData.push(app);
        await eo_kv.put(APPS_KEY, JSON.stringify(appsData));

        return createResponse(true, app);
    } catch (error) {
        console.error('添加应用失败:', error);
        return createResponse(false, null, '添加应用失败');
    }
}

// 更新应用
export async function onRequestPut({ request, params }) {
    try {
        const app: GradioApp = await request.json();
        const directUrl = decodeURIComponent(params.url);

        // 获取当前应用列表
        const appsData: GradioApp[] = await eo_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 查找并更新应用
        const index = appsData.findIndex(a => a.directUrl === directUrl);
        if (index === -1) {
            return createResponse(false, null, '应用不存在');
        }

        appsData[index] = app;
        await eo_kv.put(APPS_KEY, JSON.stringify(appsData));

        return createResponse(true, app);
    } catch (error) {
        console.error('更新应用失败:', error);
        return createResponse(false, null, '更新应用失败');
    }
}

// 删除应用
export async function onRequestDelete({ params }) {
    try {
        const directUrl = decodeURIComponent(params.url);

        // 获取当前应用列表
        const appsData: GradioApp[] = await eo_kv.get(APPS_KEY, { type: 'json' }) || [];

        // 过滤掉要删除的应用
        const newApps = appsData.filter(a => a.directUrl !== directUrl);

        // 如果没有变化，说明应用不存在
        if (newApps.length === appsData.length) {
            return createResponse(false, null, '应用不存在');
        }

        // 保存更新后的列表
        await eo_kv.put(APPS_KEY, JSON.stringify(newApps));
        return createResponse(true);
    } catch (error) {
        console.error('删除应用失败:', error);
        return createResponse(false, null, '删除应用失败');
    }
}

// 批量添加应用
export async function onRequestPost({ request }, { type = 'single' }) {
    try {
        if (type === 'batch') {
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
        } else {
            // 单个应用添加的原有逻辑
            const app: GradioApp = await request.json();
            const appsData: GradioApp[] = await eo_kv.get(APPS_KEY, { type: 'json' }) || [];

            if (appsData.some(a => a.directUrl === app.directUrl)) {
                return createResponse(false, null, '应用已存在');
            }

            appsData.push(app);
            await eo_kv.put(APPS_KEY, JSON.stringify(appsData));

            return createResponse(true, app);
        }
    } catch (error) {
        console.error('添加应用失败:', error);
        return createResponse(false, null, '添加应用失败');
    }
}

// 导入应用
export async function onRequestPost({ request }, { type = 'import' }) {
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
export async function onRequestGet({ }, { type = 'export' }) {
    try {
        if (type === 'export') {
            const appsData = await eo_kv.get(APPS_KEY, { type: 'json' });
            return createResponse(true, appsData || []);
        }
        // 普通获取应用列表的逻辑
        return onRequestGet();
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