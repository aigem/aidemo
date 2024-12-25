export interface GradioApp {
  id: string;               // 应用唯一标识
  directUrl: string;        // 应用直接访问地址
  name: string;             // 应用名称
  description: string;      // 应用描述
  category: string;         // 应用类别
  imageUrl?: string;        // 应用预览图
  isTop?: boolean;          // 是否置顶
  viewCount: number;        // 浏览数量
  likeCount: number;        // 点赞数量
  status: 'active' | 'maintenance' | 'offline';  // 应用状态
  tags: string[];          // 标签列表
  createdAt: number;       // 创建时间
  updatedAt: number;       // 更新时间
  author?: {               // 作者信息
    name: string;
    avatar?: string;
    contact?: string;
  };
  meta?: {                 // 元数据
    version?: string;      // 版本号
    framework?: string;    // 使用的框架
    requirements?: string[]; // 系统要求
    apiKey?: boolean;      // 是否需要 API Key
  };
  stats?: {               // 统计信息
    avgResponseTime?: number;  // 平均响应时间
    uptime?: number;          // 运行时间百分比
    lastChecked?: number;     // 最后检查时间
  };
}

// 应用类别
export const CATEGORIES = [
  '文本生成',
  '图像生成',
  '音频处理',
  '计算机视觉',
  '多模态',
  '对话系统',
  '代码生成',
  '其他'
] as const;

// 应用状态
export const APP_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline'
} as const;

// 常用标签
export const COMMON_TAGS = [
  'AI',
  'LLM',
  'GPT',
  'Stable Diffusion',
  'DALL-E',
  'Whisper',
  'Claude',
  'Llama',
  'ChatGPT',
  '开源'
] as const;

// 类别类型
export type Category = typeof CATEGORIES[number];

// 应用状态类型
export type AppStatus = typeof APP_STATUS[keyof typeof APP_STATUS];

// 标签类型
export type Tag = typeof COMMON_TAGS[number] | string;