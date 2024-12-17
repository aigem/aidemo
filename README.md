## 使用说明

1. 在开始之前，请先配置好`vite.config.ts`和`.env`文件
   - `vite.config.ts`：根据ai应用的名称修改输出目录
   - `.env`：修改引用huggingface space的外部引用url
2. 如果要更新导航栏的内容，请修改`src/config/navigation.ts`
3. 修改好之后，运行以下命令
   - `pnpm install`
   - `pnpm run dev`
   - `pnpm run build`

4. 部署到edgeone
   - 在edgeone上创建新的应用
   - 读取repo中的dist文件夹的指定应用文件夹
   - 配置应用的入口文件为`index.html`