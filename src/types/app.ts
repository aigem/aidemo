export interface GradioApp {
  directUrl: string;
  name: string;
  description: string;
  category?: string;
}

// 应用类别
export const CATEGORIES = [
  '文本生成',
  '图像生成',
  '音频处理',
  '计算机视觉',
  '其他'
];

// 类别类型
export type Category = (typeof CATEGORIES)[number];