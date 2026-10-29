# 框架职责与目录

该仓库是独立React/Next知识站。基础教程与项目实践共享相同DocsShell与CSS，内容后续重新编写。运行时不依赖教程API、数据库、Mintlify账号或github.io。

| 目录 | 职责 |
| --- | --- |
| web/src/app | 首页、FastAPI教程/实战、LangChain实战、RAG实战；内部组件预览与404 |
| web/src/components/docs | 统一外壳、连续章节、代码/提示、搜索、目录、图/文件组件 |
| web/src/content/site.ts | 栏目、有效入口、标题与导航数据 |
| web/src/lib/framework | 最少类型、注册/检索/hash、受控文本导出、高亮与样例加载 |
| web/fixtures | 独立组件测试素材，不是教程 |
| web/public/fonts | 本地字体、CSS与OFL许可证 |
| web/scripts | standalone打包/启动、预览开关、依赖与路由检查 |
| web/tests | 有意义的检索/注册/状态/SSR/导出契约 |
| docs/planning | 页面标准、写作规范和后续路线 |
| docs/evidence | 官方参考、字体来源与当前验收记录 |
| docs/agent-continuity | 当前任务与后续接续记录 |

首屏/全部章节/默认代码由预渲染提供；局部标签、搜索、图与目录由客户端增强。阅读位置、代码组选中、文件版本和图节点是不同局部状态，不以一个下标替换整章。

默认构建不开放内部预览，显式framework命令使用独立.next-framework产物。正式与预览使用同一模板，区别只有数据与入口，不保留legacy外壳。

后续新教程的源码引用限定白名单目录和真实版本/hash。内部fixture同样使用白名单，浏览器不读取本地磁盘。新工程/概念/阶段类型随首批内容扩展，不先建立CMS或通用课程生成器。
