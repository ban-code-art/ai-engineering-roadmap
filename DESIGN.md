# AI Engineering Roadmap

## 当前范围

构建一个中文AI工程学习知识库，当前从FastAPI方向开始。基础教程与项目实践统一使用LangChain官方文档风格的React/TSX模板：分组导航、连续正文、页内目录、代码与提示、局部图/文件，以及本地搜索和主题。

旧教程、旧示例业务、旧前端和批量生成脚本已退出本项目；后续内容重新编写，不迁移旧教材。顶部以FastAPI教程、FastAPI项目实战、LangChain项目实战、RAG项目实战分类；首页从品牌/侧栏进入，各课程入口均注明内容待编写。

## 唯一设计入口

| 任务 | 依据 |
| --- | --- |
| 页面布局、颜色、字体与阅读交互 | [前端页面设计LC-DOCS-2.0](docs/planning/frontend-page-design.md) |
| 解释深度、分块、源码、预测与恢复 | [重新编写规范](docs/planning/writing-standard.md) |
| 分批实施顺序 | [路线](docs/planning/roadmap.md) |
| 组件/内容/运行职责 | [架构](docs/planning/architecture.md) |

所有后续基础教程和项目实践均使用同一模板；禁止重新引入VitePress/Markdown解析页面或另一套项目仪表盘。字体为本地OFL资源；标题Manrope是公开记录的TWK替代，不伪称官方字形完全一致。

组件样例在显式内部预览中运行，不能作为已编写课程。框架测试、真实新教学源码、初学者跟做和部署分别记录，不互相替代。

## 接续

当前进度见[handoff.md](docs/agent-continuity/handoff.md)。完成结构清理、统一模板与仓库上传后，按路线重新设计首批内容。
