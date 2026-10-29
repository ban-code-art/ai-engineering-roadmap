# Handoff

## Snapshot

- Goal: 保留统一LangChain风格框架，基础/项目共用模板；丢弃旧教程，上传新仓库后重新编写。
- Progress: 清理后的统一框架已上传ban-code-art/ai-engineering-roadmap；初始提交5802aee，远程main一致，旧教程未进入Git历史。
- Next: 按docs/planning/roadmap.md重新设计首批基础教程与配套项目实践，同一模板从零编写。

## Read First

- DESIGN.md唯一入口；frontend-page-design.md LC-DOCS-2.0、writing-standard.md、architecture.md与roadmap.md负责后续开发。
- web/README.md说明命令、预览与正式输出区分。

## Do Not Change

- 不恢复旧教程/示例业务/legacy/VitePress；没有旧课程迁移T0。
- 基础教程与项目实践必须共享components/docs和app/docs.css，不创建另一套项目主题。
- 组件fixtures不是教程，正式索引不收录预览/未编写章节。

## Current Risks

- Git已建立初始main历史和origin远程，后续保留历史；不要再次初始化或强推。
- 标题Manrope是明确字体差异，TWK不再分发。
- 当前只交付空内容入口和模板，新教程/学习效果未完成；禁用JS完整浏览器实测与远程部署尚未验收。
- Node服务监听本地3000/3001；重建前停止对应任务服务，避免Windows锁住输出目录。

## Last Interaction

- 用户创建ai-engineering-roadmap仓库，要求清理/上传；补充基础和项目共用LangChain模板，并明确不要保留现有教程，后续重新编写。

## Continue From

- 新教程从零设计/编写，使用已保留的统一框架；当前正式/learn和/project仅有编写状态。
- 代码源、框架fixture和正式内容需分别维护，引用真实新源码并逐批验收。
