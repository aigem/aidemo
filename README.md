# 独门 AI DEMO 平台

独门 AI DEMO 是一个展示和体验最新 AI 应用的平台。在这里，您可以探索各种创新的 AI 应用，体验人工智能的最新发展。

## 功能特点

- 应用浏览与搜索
  - 支持按名称、描述、分类进行搜索
  - 支持分类筛选
  - 支持列表和卡片两种视图模式
  
- 应用管理
  - 单个添加应用
  - 批量导入应用
  - 编辑应用信息
  - 删除应用
  
- 离线支持
  - 支持离线缓存应用数据
  - 自动同步更新
  
- 性能优化
  - 延迟加载
  - 数据缓存
  - 批量操作优化

## 技术栈

- 前端框架: React 18
- 路由: React Router 6
- 类型检查: TypeScript
- UI 组件: Tailwind CSS
- HTTP 客户端: Axios
- 构建工具: Vite
- 开发语言: TypeScript

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/yourusername/demoai.git
cd demoai
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 使用说明

### 浏览应用

1. 在首页可以浏览所有应用
2. 使用搜索框搜索应用
3. 点击应用卡片查看详情
4. 支持全屏查看应用

### 管理应用

1. 添加单个应用
   - 点击"单个添加"按钮
   - 填写应用信息（名称、描述、分类、地址）
   - 提交表单

2. 批量添加应用
   - 点击"批量添加"按钮
   - 输入符合格式的 JSON 数据
   - JSON 格式示例:
   ```json
   [
     {
       "name": "应用名称",
       "description": "应用描述",
       "category": "应用分类",
       "directUrl": "应用地址"
     }
   ]
   ```

3. 编辑应用
   - 在应用列表中点击"编辑"按钮
   - 修改应用信息
   - 保存更改

4. 删除应用
   - 在应用列表中点击"删除"按钮
   - 确认删除操作

### 离线功能

- 启用离线模式后，应用数据会被缓存
- 在无网络环境下仍可访问已缓存的应用
- 恢复网络连接后会自动同步数据

## 配置说明

### 环境变量

在项目根目录创建 `.env` 文件:

```env
# API 配置
VITE_API_BASE_URL=http://your-api-url
VITE_API_TIMEOUT=30000

# 功能开关
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# 存储配置
VITE_STORAGE_PREFIX=demoai
VITE_STORAGE_TTL=86400
```

### 功能开关

可以在 `src/config/features.ts` 中配置功能开关:

```typescript
export const features = {
  enableOfflineMode: true,
  enablePerformanceMonitoring: true,
  enableAutoSync: true,
  enableErrorReporting: true
};
```

## 开发指南

### 目录结构

```
src/
  ├── components/     # 通用组件
  ├── pages/         # 页面组件
  ├── services/      # 业务服务
  ├── utils/         # 工具函数
  ├── contexts/      # React Context
  ├── config/        # 配置文件
  └── types/         # TypeScript 类型定义
```

### 添加新功能

1. 在相应目录创建新文件
2. 导出组件/函数/服务
3. 在需要的地方导入使用
4. 添加必要的类型定义
5. 更新测试用例

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 使用函数组件和 Hooks
- 保持组件的单一职责
- 编写清晰的注释

## 部署说明

1. 构建生产版本
```bash
npm run build
```

2. 将 `dist` 目录下的文件部署到服务器

3. 配置服务器
   - 设置正确的 API 地址
   - 配置 CORS 策略
   - 启用 HTTPS
   - 配置缓存策略

## 常见问题

1. 应用加载失败
   - 检查网络连接
   - 验证 API 地址配置
   - 查看控制台错误信息

2. 离线模式不工作
   - 确认已启用离线模式
   - 检查浏览器存储限制
   - 验证缓存配置

3. 性能问题
   - 检查网络请求
   - 查看性能监控数据
   - 优化数据加载策略

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License