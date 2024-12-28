import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useApps } from '../contexts/AppContext';
import { getFullUrlFromAppId } from '../utils/url';
import { SEO } from '../components/SEO';

export function AppDetailPage() {
    const { appId } = useParams<{ appId: string }>();
    const { state } = useApps();
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 获取完整 URL
    const fullUrl = appId ? getFullUrlFromAppId(decodeURIComponent(appId)) : '';

    // 查找应用
    const app = state.apps.find(a => a.directUrl === fullUrl);

    if (!app) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">应用未找到</h2>
                        <p className="text-gray-600 mb-6">
                            抱歉，您请求的应用（{appId}）不存在或已被删除。
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回首页
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const containerClass = isFullscreen
        ? 'fixed inset-0 z-50 bg-white'
        : 'min-h-screen bg-gray-50 p-8';

    const contentClass = isFullscreen
        ? 'h-full'
        : 'max-w-7xl mx-auto bg-white rounded-lg shadow-md';

    return (
        <>
            {app && (
                <SEO
                    title={`${app.name} - 独门 AI DEMO`}
                    description={app.description}
                    keywords={`${app.category},${app.tags?.join(',')},AI应用`}
                    type="article"
                    image={app.imageUrl}
                    url={`https://demo.duu.men/app/${encodeURIComponent(app.directUrl)}`}
                    app={app}
                />
            )}
            <div className={containerClass}>
                <div className={contentClass}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="inline-flex items-center text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                返回首页
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{app.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {app.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                                title={isFullscreen ? '退出全屏' : '全屏显示'}
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="w-5 h-5" />
                                ) : (
                                    <Maximize2 className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`w-full ${isFullscreen ? 'h-[calc(100%-64px)]' : 'h-[800px]'}`}>
                        <iframe
                            src={app.directUrl}
                            title={app.name}
                            className="w-full h-full border-0"
                            allow="accelerometer; camera; microphone; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </>
    );
} 