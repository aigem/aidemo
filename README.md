# AI 应用管理平台

一个用于管理和展示 AI 应用的平台，支持多种类型的应用管理，包括文本生成、图像生成、音频处理和计算机视觉等。

## 功能特点

### 应用管理
- 支持单个和批量添加应用
- 应用分类管理（文本生成、图像生成、音频处理、计算机视觉等）
- 应用信息编辑和删除
- 应用状态实时保存

### 应用访问
- 支持新窗口打开应用
- 支持全屏模式
- 支持直接访问原始地址
- 优化的 URL 格式，更简洁易读

### 搜索和筛选
- 支持应用名称和描述搜索
- 按类别筛选
- 分页显示

## 快速开始

### 安装依赖
```bash
npm install
# 或
yarn
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

### 构建
```bash
npm run build
# 或
yarn build
```

## 部署说明

### 1. 环境准备

#### 安装 Edgeone CLI
```bash
npm install -g edgeone
```

#### 初始化项目
```bash
# 初始化 functions 目录
edgeone pages init

# 关联项目
edgeone pages link

# 本地开发调试
edgeone pages dev
```

### 2. KV 存储配置

#### 创建 KV 命名空间
1. 登录 Edgeone Pages 控制台
2. 创建新的 KV 命名空间
3. 记录命名空间 ID

#### 配置项目 KV 绑定
1. 在项目的 `edgeone.json` 中添加 KV 配置：
```json
{
  "bindings": {
    "my_kv": {
      "type": "kv",
      "id": "your-kv-namespace-id"
    }
  }
}
```

2. 在 Functions 中直接使用 KV：
```typescript
// 直接使用全局的 my_kv 变量
const data = await my_kv.get('key', { type: 'json' });
await my_kv.put('key', JSON.stringify(value));
```

### 3. 部署流程

#### 自动部署
1. 推送代码到仓库
```bash
git add .
git commit -m "更新应用"
git push
```
2. Edgeone Pages 会自动触发构建和部署

#### 手动部署
```bash
# 构建项目
npm run build

# 部署到 Edgeone Pages
edgeone deploy
```

### 4. 验证部署

#### 检查 API 端点
```bash
# 获取应用列表
curl https://your-site.edgeone.dev/api/apps

# 测试添加应用
curl -X POST https://your-site.edgeone.dev/api/apps \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试应用",
    "directUrl": "https://example.com",
    "description": "测试描述",
    "category": "其他"
  }'
```

#### 检查 KV 存储
1. 在 Edgeone Pages 控制台查看 KV 存储状态
2. 确认数据是否正确保存
3. 监控存储使用量

## 使用说明

### 1. 添加应用

#### 单个添加
1. 点击"添加单个应用"按钮
2. 填写应用信息：
   - 应用地址（URL）
   - 应用名称
   - 应用描述
   - 选择类别
3. 点击"添加"按钮保存

#### 批量添加
1. 点击"批量添加应用"按钮
2. 按以下格式输入应用信息（每行一个）：
   ```
   URL,应用名称,应用描述
   ```
3. 选择统一的应用类别
4. 点击"导入"按钮

### 2. 访问应用

#### URL 格式
- 简化格式：`/app/应用名称`
  例如：`/app/qwen-qvq-72b-preview`
- 完整格式：`/app/完整URL`
  例如：`/app/https://example.com/app`

#### 访问方式
1. 新窗口打开（推荐）：
   - 点击应用卡片上的外链图标
   - 支持全屏切换
   - 可直接访问原始地址

2. 预览模式：
   - 点击预览按钮（眼睛图标）
   - 在弹窗中快速预览

### 3. 应用管理

#### 编辑应用
1. 点击应用卡片上的编辑图标
2. 修改应用信息
3. 点击"更新"保存

#### 删除应用
1. 点击应用卡片上的删除图标
2. 确认删除操作

### 4. 搜索和筛选

#### 搜索应用
- 在搜索框输入关键词
- 支持应用名称和描述搜索
- 实时显示搜索结果

#### 类别筛选
- 使用类别下拉框选择特定类别
- 选择"所有类别"显示全部应用

## API 使用说明

### 1. 应用数据结构
```typescript
interface GradioApp {
  directUrl: string;    // 应用直接访问地址
  name: string;         // 应用名称
  description: string;  // 应用描述
  category?: string;    // 应用类别
}
```

### 2. KV 存储 API

#### 数据格式
```typescript
// KV 中的数据结构
{
  "apps_data": [
    {
      "directUrl": "https://example.com/app1",
      "name": "应用1",
      "description": "描述1",
      "category": "文本生成"
    }
  ]
}
```

#### API 端点
- GET `/api/apps` - 获取所有应用
- POST `/api/apps` - 添加新应用
- PUT `/api/apps` - 更新应用列表
- DELETE `/api/apps/:url` - 删除指定应用

#### 错误处理
- API 调用失败时自动降级到本地存储
- 本地存储作为备份机制
- 提供详细的错误信息

## 注意事项

### KV 存储限制
- 单个键值对大小限制：25 MB
- 键名长度限制：512 字节
- 建议定期备份数据

### 部署注意事项
1. **环境变量**
   - 确保 KV 绑定正确配置
   - 检查访问权限设置

2. **CORS 设置**
   - API 已配置允许跨域访问
   - 可根据需要调整 CORS 策略

3. **缓存策略**
   - API 响应默认不缓存
   - 可根据需要调整缓存设置

4. **数据备份**
   - 定期导出应用数据
   - 保持本地备份

## 开发计划

- [ ] 添加应用使用统计
- [ ] 添加应用分享功能
- [ ] 添加应用评分和评论
- [ ] 支持更多应用类型
- [ ] 添加用户管理功能
- [ ] 支持应用配置导入/导出