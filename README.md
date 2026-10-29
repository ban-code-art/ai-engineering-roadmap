# AI Engineering Roadmap

中文AI工程学习知识库，基础教程与项目实践共用一套LangChain风格文档框架。当前完成框架基础与栏目入口，教程内容将重新编写。

## 本地运行

需要Node.js 24–26。依赖只由 `web/package-lock.json` 管理：

```powershell
npm.cmd run setup
npm.cmd run dev
```

打开 http://127.0.0.1:3000 。生产模式执行：

```powershell
npm.cmd run build
npm.cmd start
```

内部组件预览独立启动：

```powershell
npm.cmd run build:framework
npm.cmd run start:framework
```

打开 http://127.0.0.1:3001/framework-preview 。默认构建不开放预览，旧教程地址返回404。

## 项目结构

```text
web/                  统一React/Next前端、组件、测试和独立fixture
  src/app/            首页、基础教程、项目实践与内部预览
  src/components/docs/ LangChain风格共享文档组件
  src/content/site.ts 有效栏目与导航
  public/fonts/       本地字体和OFL许可证
  scripts/            构建、启动和验收工具
  tests/              框架契约测试
docs/planning/        页面设计、写作规范、路线与架构
docs/evidence/        官方依据和当前验收记录
docs/agent-continuity/ 当前接续状态
.github/workflows/    前端CI检查
```

旧教材、旧教学业务源码、VitePress与批量生成工具不进入此仓库。`web/fixtures/`仅用于组件测试，不是教学内容。

## 开发标准

后续先按[DESIGN.md](DESIGN.md)及[页面设计](docs/planning/frontend-page-design.md)设计首批任务，再分批编写新教程与真实源码。两类教程使用同一字体、颜色、布局、代码与提示系统。学习页使用受控TSX，不解析Markdown/MDX，不依赖付费文档平台或教程API在线。

执行 `npm.cmd test`、`npm.cmd run build` 和 `npm.cmd run typecheck` 检查框架；运行服务后在web目录执行 `npm.cmd run verify:site` 验证三条入口、旧课404与本地资源。UI与学习效果另做实际验收。

标题使用开源Manrope，正文Inter、代码IBM Plex Mono与中文Noto Sans SC。字体来源、许可和与官方TWK字族的差异见[记录](docs/evidence/langchain-reference/font-assets.json)，许可随资源交付。
