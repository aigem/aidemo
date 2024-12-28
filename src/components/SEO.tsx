import { useEffect } from 'react';
import type { GradioApp } from '../types/app';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: 'website' | 'article';
    image?: string;
    url?: string;
    app?: GradioApp;
}

export function SEO({
    title = '独门 AI DEMO - AI 应用管理平台',
    description = '独门 AI DEMO 是一个专业的 AI 应用管理平台，提供文本生成、图像生成、音频处理和计算机视觉等多种 AI 应用服务。',
    keywords = 'AI应用,人工智能,文本生成,图像生成,音频处理,计算机视觉,AI管理平台',
    type = 'website',
    image = 'https://demo.duu.men/og-image.jpg',
    url = 'https://demo.duu.men/',
    app
}: SEOProps) {
    useEffect(() => {
        // 更新标题
        document.title = title;

        // 更新 meta 标签
        const metaTags = {
            description,
            keywords,
            'og:title': title,
            'og:description': description,
            'og:type': type,
            'og:url': url,
            'og:image': image,
            'twitter:card': 'summary_large_image',
            'twitter:title': title,
            'twitter:description': description,
            'twitter:image': image
        };

        // 如果是应用详情页，添加额外的结构化数据
        if (app) {
            const structuredData = {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: app.name,
                description: app.description,
                applicationCategory: app.category,
                url: app.directUrl,
                ...(app.imageUrl && { image: app.imageUrl }),
                ...(app.author && {
                    author: {
                        '@type': 'Organization',
                        name: app.author.name
                    }
                })
            };

            // 添加结构化数据脚本
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(structuredData);
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }

        // 更新所有 meta 标签
        Object.entries(metaTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`) ||
                document.querySelector(`meta[property="${name}"]`);

            if (!meta) {
                meta = document.createElement('meta');
                if (name.startsWith('og:')) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }

            meta.setAttribute('content', content);
        });

        // 更新 canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    }, [title, description, keywords, type, image, url, app]);

    return null;
} 