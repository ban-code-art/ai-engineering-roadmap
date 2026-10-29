# Handoff

## Snapshot

- Goal: 保留统一LangChain风格框架，基础/项目共用模板；丢弃旧教程，上传新仓库后重新编写。
- Progress: 项目结构已清理，旧教材/教学业务/旧前端退出；三条正式入口与独立fixtures已验证，准备初始提交上传。
- Next: 完成远程提交核对后，按docs/planning/roadmap.md重新设计首批内容。

## Read First

- DESIGN.md唯一入口；frontend-page-design.md LC-DOCS-2.0、writing-standard.md、architecture.md与roadmap.md负责后续开发。
- web/README.md说明命令、预览与正式输出区分。

## Do Not Change

- 不恢复旧教程/示例业务/legacy/VitePress；没有旧课程迁移T0。
- 基础教程与项目实践必须共享components/docs和app/docs.css，不创建另一套项目主题。
- 组件fixtures不是教程，正式索引不收录预览/未编写章节。

## Current Risks

- 上传前本地尚无Git提交，远程仓库为空；完成后以远程main验证结果为准。
- 标题Manrope是明确字体差异，TWK不再分发。
- 当前只交付空内容入口和模板，新教程/学习效果未完成；禁用JS完整浏览器实测与远程部署尚未验收。
- Node服务监听本地3000/3001；重建前停止对应任务服务，避免Windows锁住输出目录。

## Last Interaction

- 用户创建ai-engineering-roadmap仓库，要求清理/上传；补充基础和项目共用LangChain模板，并明确不要保留现有教程，后续重新编写。

## Continue From

- 新教程从零设计/编写，使用已保留的统一框架；当前正式/learn和/project仅有编写状态。
- 代码源、框架fixture和正式内容需分别维护，引用真实新源码并逐批验收。
