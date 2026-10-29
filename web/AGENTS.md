# 页面与教程实现规则

本目录继承根[AGENTS.md](../AGENTS.md)。任何新增章节或页面修改均自动遵循[全局设计](../DESIGN.md)、[写作规范](../docs/planning/writing-standard.md)和[页面规范](../docs/planning/frontend-page-design.md)，不以用户是否再次提及为条件。

- 使用共享DocsShell/文档组件与现有字体、主题；一章一页，章内连续阅读，未发布章节不加入导航或搜索。
- 专业词汇配白话解释，难点使用准确生活例子并映射回代码；必需解释不能只藏在折叠项中。
- 命令使用明确的系统标签，默认Windows · PowerShell；代码框内只保留代码/必要原因注释及复制操作，标题/平台标签和来源放框外。
- 沿用蓝灰阅读层次、局部重点行和必要对照卡片；图要清楚、美观、可访问，适配手机与双主题。
- 代码片段使用真实固定源码，复制保留原文；实现完成按写作规范的检查表审阅，再扩充下一批。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
