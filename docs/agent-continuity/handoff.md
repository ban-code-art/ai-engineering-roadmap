# Handoff

## Snapshot

- Goal: 依据FA-CURRICULUM-1.0逐批写通俗、独立页面的FastAPI基础课，长期完成TaskBoard API demo。
- Progress: W01最新展示改造已推送bd1f8cf：代码区纯代码/框后来源、局部重点行、蓝灰阅读面/少量对照与导航卡片，LC-DOCS-2.1；28前端检查/构建/类型/路由、桌面手机/双主题通过。源码A739a064和15文件hash继续固定，教学源未改。
- Next: 本批结束；下次从W02/F04–F06首接口创建/启动/排错校准开始。

## Read First

- DESIGN.md唯一设计入口，fastapi-curriculum.md唯一课程脉络；writing-standard.md负责解释/图/固定源。
- docs/evidence/verification/fastapi-w01-review.md及labs.json/diagrams.md是本批证据，checkpoint与evidence列最后验证。

## Do Not Change

- 一章一页、章内连续小节，共享DocsShell；未发布章不加入导航/搜索，不恢复旧教材或fixtures当课程。
- 基础课在/learn逐步长成demo，不跳入/project另一个实践专栏。W01没有API服务，首应用从F04开始。
- 源码先发布提交/检查点，页面manifest按各sourceRef固定40位SHA/hash；不回退main或工作文件；读者无需Git/在线demo。

## Current Risks

- 真实初学者/PyCharm跟做、完整浏览器禁JS未完成；SSR默认正文/代码/SVG已验证，不夸大学习效果。
- Windows作者3.12.4实测，3.12.10仅安装入口；Linux完整环境CI通过，macOS本地仍未运行。
- 本机npm用户配置冲突可用--userconfig=NUL命令级覆盖，不改全局设置。
- 本地生产3000与预览3001已重新启动。重建前核对监听PID和命令身份再停止，避免Windows文件锁。

## Last Interaction

- 用户最新要求清理代码框重复文件/版本/源码信息，代码优先；减少大片白色和单调，继续参考LangChain文档层次。改造证据见docs/evidence/verification/reading-refresh.md，后续写作使用2.1。

## Continue From

- W02：F04解释FastAPI导入、对象创建/赋值、路由登记与完整函数；F05真实HTTP运行；F06调试/恢复，不先引入数据库或身份。
- 长期TaskBoard API：内存→组织→同步SQLite/身份M4→异步PG→客户端/附件/观测→Docker/恢复M7；F37选读背景任务不承诺可靠队列。
