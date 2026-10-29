# AI Engineering Roadmap

## 当前范围

构建一个中文AI工程学习知识库，当前从FastAPI方向开始。基础教程与项目实践统一使用LangChain官方文档风格的React/TSX模板：分组导航、连续正文、页内目录、代码与提示、局部图/文件，以及本地搜索和主题。

当前任务是 **FastAPI教程的分批编写**：依据[课程设计](docs/planning/fastapi-curriculum.md)，W01/F01–F03 先完成 HTTP、环境与必要 Python。长期保持8分区、42独立章（41主线/1选读）和M0–M7完整 TaskBoard API demo 路线；每批最多3章，一章一页，章内连续阅读。

旧教程、旧示例业务、旧前端和批量生成脚本已退出本项目；后续内容重新编写，不迁移旧教材。顶部以FastAPI教程、FastAPI项目实战、LangChain项目实战、RAG项目实战分类；首页从品牌/侧栏进入，各课程入口均注明内容待编写。

## 唯一设计入口

| 任务 | 依据 |
| --- | --- |
| 页面布局、颜色、字体与阅读交互 | [前端页面设计LC-DOCS-2.1](docs/planning/frontend-page-design.md) |
| FastAPI教程的分区、独立章节、前置、demo演进、配图与源码入口 | [FastAPI课程设计FA-CURRICULUM-1.0](docs/planning/fastapi-curriculum.md) |
| 解释深度、分块、源码、预测与恢复 | [重新编写规范](docs/planning/writing-standard.md) |
| 分批实施顺序 | [路线](docs/planning/roadmap.md) |
| 组件/内容/运行职责 | [架构](docs/planning/architecture.md) |

所有后续基础教程和项目实践均使用同一模板；禁止重新引入VitePress/Markdown解析页面或另一套项目仪表盘。字体为本地OFL资源；标题Manrope是公开记录的TWK替代，不伪称官方字形完全一致。

组件样例在显式内部预览中运行，不能作为已编写课程。框架测试、真实新教学源码、初学者跟做和部署分别记录，不互相替代。

## 接续

当前进度见[handoff.md](docs/agent-continuity/handoff.md)。W01 三章已编写，源码先发布再固定引用到页面；W02 及后续逐批推进，不恢复旧材料，不提前开放未完成章节。

用户最新视觉要求：代码框只显示代码和复制按钮，来源/版本放框后；借鉴LangChain局部行高亮与卡片，使用分层蓝灰阅读面、淡色对照和现有图形，减少大片纯白。具体以2.1规则为准，教学源码的固定SHA继续保留。
