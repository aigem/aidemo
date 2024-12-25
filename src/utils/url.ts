// 默认域名
const DEFAULT_DOMAIN = 'hf.space';
const DEFAULT_PROTOCOL = 'https://';

// 从完整 URL 中提取应用 ID
export function getAppIdFromUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        // 移除协议、域名和路径中的斜杠
        return urlObj.hostname.replace(`.${DEFAULT_DOMAIN}`, '');
    } catch {
        // 如果不是有效的 URL，返回原始字符串
        return url;
    }
}

// 从应用 ID 生成完整 URL
export function getFullUrlFromAppId(appId: string): string {
    if (appId.startsWith('http://') || appId.startsWith('https://')) {
        return appId;
    }

    // 如果不包含域名，添加默认域名
    if (!appId.includes('.')) {
        return `${DEFAULT_PROTOCOL}${appId}.${DEFAULT_DOMAIN}`;
    }

    // 如果只有域名没有协议，添加协议
    return appId.startsWith('//') ? `https:${appId}` : `${DEFAULT_PROTOCOL}${appId}`;
}

// 生成用于路由的应用路径
export function getAppPath(appId: string): string {
    return `/app/${encodeURIComponent(getAppIdFromUrl(appId))}`;
}

// 从路由路径获取完整 URL
export function getUrlFromPath(path: string): string {
    const decodedAppId = decodeURIComponent(path);
    return getFullUrlFromAppId(decodedAppId);
} 