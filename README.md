# AI Engineering Roadmap

中文AI工程学习知识库，基础教程与项目实践共用一套LangChain风格文档框架。FastAPI 教程已发布第一批入门准备三章。

顶部课程入口：FastAPI 教程（`/learn`）、FastAPI 项目实战（`/project`）、LangChain 项目实战（`/project/langchain`）、RAG 项目实战（`/project/rag`）。四个课程统一模板，独立项目实践尚待编写。

课程按[FastAPI基础教程脉络](docs/planning/fastapi-curriculum.md)逐批推进：8个分区、42个独立章节，先基础再工程，最终逐步完成 TaskBoard API demo。当前 W01：F01 读懂 HTTP 请求与响应、F02 准备环境与项目根目录、F03 必要 Python；独立路由位于 `/learn/fastapi/<slug>`。F04 与后续阶段尚未编写，当前 lab 不包含 API 服务。

短代码从已发布检查点 `fastapi-w01` 的固定提交提取，详情见 [source-manifest.json](courses/fastapi/source-manifest.json)。源码 SHA/hash/路径或行号错误会阻止构建；浅克隆缺对象时取回固定 tag 并核对 SHA。预渲染页面随部署携带代码，读者不需要 Git 或在线教程 API。

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
  src/app/            首页、四个课程入口与内部预览
  src/components/docs/ LangChain风格共享文档组件
  src/content/site.ts 有效栏目与导航
  src/content/fastapi/ 三章受控TSX与已发布课程索引
  public/fonts/       本地字体和OFL许可证
  scripts/            构建、启动和验收工具
  tests/              框架契约测试
docs/planning/        页面设计、写作规范、路线与架构
docs/evidence/        官方依据和当前验收记录
docs/agent-continuity/ 当前接续状态
courses/fastapi/      新lab、依赖锁、验证脚本与固定源manifest
.github/workflows/    前端CI检查
```

旧教材、旧教学业务源码、VitePress与批量生成工具不进入此仓库。`web/fixtures/`仅用于组件测试，不是教学内容。

## 开发标准

后续先按[DESIGN.md](DESIGN.md)及[页面设计](docs/planning/frontend-page-design.md)设计首批任务，再分批编写新教程与真实源码。两类教程使用同一字体、颜色、布局、代码与提示系统。学习页使用受控TSX，不解析Markdown/MDX，不依赖付费文档平台或教程API在线。

[AGENTS.md](AGENTS.md)登记每次工作的必读链；[写作规范](docs/planning/writing-standard.md)维护长期教学规则与逐批检查表。Windows命令、专业词汇配白话/生活例子、短代码、认真绘图、纯代码框与统一页面规则默认持续生效，后续请求无需再次列出。

执行 `npm.cmd test`、`npm.cmd run build` 和 `npm.cmd run typecheck`；运行服务后在web目录执行 `npm.cmd run verify:site` 检查首页、四个课程入口、三章、未发布/旧课404与本地资源。Python 配套源验证见 [courses/fastapi/README.md](courses/fastapi/README.md)。作者运行、浏览器与真实学习者跟做分别记录，详见 [W01 核查](docs/evidence/verification/fastapi-w01-review.md)。

标题使用开源Manrope，正文Inter、代码IBM Plex Mono与中文Noto Sans SC。字体来源、许可和与官方TWK字族的差异见[记录](docs/evidence/langchain-reference/font-assets.json)，许可随资源交付。
