# Repository instructions

## 后续工作的默认规则

这些是本仓库持续生效的编写要求。继续任务时先核对[接续记录](docs/agent-continuity/handoff.md)。开始新章节、修改教材、编写配套源码或调整页面前，必须按顺序读取：

1. [DESIGN.md](DESIGN.md)：全局要求与规范入口。
2. [教程写作规范](docs/planning/writing-standard.md)：解释方式、命令、代码、图与逐批验收。
3. [页面规范](docs/planning/frontend-page-design.md)：共享LangChain风格框架及最新视觉规则。
4. 当前课程目录；FastAPI使用[课程设计](docs/planning/fastapi-curriculum.md)。

用户后续即使只说“继续编写”，也自动执行以上规范，不要求用户重新声明或再次确认已有要求。仅在用户明确修改某项要求时调整，并同步对应规范。不要依赖聊天记忆代替读取仓库文件，也不要另建互相竞争的页面或教学标准。

## 仓库约束

- 用简体中文维护教程和设计说明；代码标识保持原文。
- `DESIGN.md` 是唯一设计入口；基础教程与项目实践必须共享 `web/src/components/docs/` 模板及 `web/src/app/docs.css`。
- 旧教程/示例业务已移除，后续重新编写。禁止恢复VitePress、MDX教学解析、legacy外壳或批量课程生成器。
- 当前 `web/fixtures/` 仅用于文档组件测试，不是教程。
- 未编写章节不加入正式导航/搜索，内部预览默认不公开。
- 新教程按小批次设计/编写/运行/恢复与跟做验证，不以框架测试代表教学完成。
- 所有教程遵循 `DESIGN.md` 的全局教学要求及 `docs/planning/writing-standard.md`：Windows · PowerShell 命令默认可见；首次专业词汇配白话解释，较难概念用准确生活例子帮助理解，再回到真实代码并说明类比边界。
- 依赖由 `web/package-lock.json` 管理；根package只代理命令。
- 验证：`npm run setup`、`npm test`、`npm run build`、`npm run typecheck`；运行后在web执行 `npm run verify:site`。
- 字体随本地OFL资产交付，TWK Lausanne不再分发；保持来源和许可证。
