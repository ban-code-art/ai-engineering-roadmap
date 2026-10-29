# Repository instructions

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
