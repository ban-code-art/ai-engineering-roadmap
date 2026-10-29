# AI Engineering Roadmap

## 当前范围

构建一个中文AI工程学习知识库，当前从FastAPI方向开始。基础教程与项目实践统一使用LangChain官方文档风格的React/TSX模板：分组导航、连续正文、页内目录、代码与提示、局部图/文件，以及本地搜索和主题。

当前任务是 **FastAPI教程的课程结构设计**：从初学基础递进到企业开发习惯，最后交付完整TaskBoard API demo。依据[FastAPI分区与章节设计](docs/planning/fastapi-curriculum.md)，规划8个分区、42个独立章节（41主线/1选读）、M0–M7完整版本。不是顶部FastAPI项目实战专栏，不将全课程放一页；本轮不写教材正文/源码/页面。

旧教程、旧示例业务、旧前端和批量生成脚本已退出本项目；后续内容重新编写，不迁移旧教材。顶部以FastAPI教程、FastAPI项目实战、LangChain项目实战、RAG项目实战分类；首页从品牌/侧栏进入，各课程入口均注明内容待编写。

## 唯一设计入口

| 任务 | 依据 |
| --- | --- |
| 页面布局、颜色、字体与阅读交互 | [前端页面设计LC-DOCS-2.0](docs/planning/frontend-page-design.md) |
| FastAPI教程的分区、独立章节、前置、demo演进、配图与源码入口 | [FastAPI课程设计FA-CURRICULUM-1.0](docs/planning/fastapi-curriculum.md) |
| 解释深度、分块、源码、预测与恢复 | [重新编写规范](docs/planning/writing-standard.md) |
| 分批实施顺序 | [路线](docs/planning/roadmap.md) |
| 组件/内容/运行职责 | [架构](docs/planning/architecture.md) |

所有后续基础教程和项目实践均使用同一模板；禁止重新引入VitePress/Markdown解析页面或另一套项目仪表盘。字体为本地OFL资源；标题Manrope是公开记录的TWK替代，不伪称官方字形完全一致。

组件样例在显式内部预览中运行，不能作为已编写课程。框架测试、真实新教学源码、初学者跟做和部署分别记录，不互相替代。

## 接续

当前进度见[handoff.md](docs/agent-continuity/handoff.md)。结构清理与统一模板已上传；本轮只设计FastAPI基础课脉络。后续按W01/W02小批次从零编写，不恢复旧材料，也不提前开放未完成章节。
