export interface GradioApp {
  id: string;
  directUrl: string;
  name: string;
  description: string;
  category?: string;
  imageUrl?: string;
  tags?: string[];
  author?: {
    name: string;
    url?: string;
  };
  meta?: {
    title?: string;           // SEO 标题
    description?: string;     // SEO 描述
    keywords?: string[];      // SEO 关键词
    ogImage?: string;         // Open Graph 图片
    twitterImage?: string;    // Twitter 卡片图片
  };
  stats?: {
    viewCount: number;
    likeCount: number;
    shareCount: number;
    lastUpdated: number;
  };
  status: 'active' | 'maintenance' | 'offline';
  createdAt: number;
  updatedAt: number;
  isTop?: boolean;
}

// 应用类别
export const CATEGORIES = [
  '文本生成',
  '图像生成',
  '音频处理',
  '计算机视觉',
  '其他'
] as const;

// 类别类型
export type Category = typeof CATEGORIES[number];