import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { App } from '../services/appService';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: string;
    url?: string;
    image?: string;
    app?: App;
}

export function SEO({
    title = '独门 AI DEMO - 发现和体验最新的 AI 应用',
    description = '独门 AI DEMO 是一个展示和体验最新 AI 应用的平台。在这里，您可以探索各种创新的 AI 应用，体验人工智能的最新发展。',
    keywords = 'AI,人工智能,Demo,应用,体验',
    type = 'website',
    url = 'https://demo.duu.men',
    image = '/logo.png',
    app
}: SEOProps) {
    // 如果提供了应用信息，使用应用相关的 SEO 数据
    if (app) {
        title = `${app.name} - 独门 AI DEMO`;
        description = app.description || description;
        keywords = `${app.category},${keywords}`;
        url = `${url}/app/${encodeURIComponent(app.directUrl)}`;
    }

    return (
        <Helmet>
            {/* 基本元标签 */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph 标签 */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            {image && <meta property="og:image" content={image} />}

            {/* Twitter 卡片标签 */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}

            {/* 其他元标签 */}
            <meta name="robots" content="index,follow" />
            <meta name="googlebot" content="index,follow" />
            <link rel="canonical" href={url} />
        </Helmet>
    );
} 