# Handoff

## Snapshot

- Goal: 依据FA-CURRICULUM-1.0逐批写通俗、独立页面的FastAPI基础课，长期完成TaskBoard API demo。
- Progress: W01/F01–F03正文、lab、SVG、导航已完成；源A739a064与tag已推送，页面B待同步。23前端检查/9Python测试、干净Windows环境、构建/类型/双模式路由、桌面手机/双主题通过。
- Next: 同步页面B后结束本批；下次从W02/F04–F06首接口创建/启动/排错校准开始。

## Read First

- DESIGN.md唯一设计入口，fastapi-curriculum.md唯一课程脉络；writing-standard.md负责解释/图/固定源。
- docs/evidence/verification/fastapi-w01-review.md及labs.json/diagrams.md是本批证据，checkpoint与evidence列最后验证。

## Do Not Change

- 一章一页、章内连续小节，共享DocsShell；未发布章不加入导航/搜索，不恢复旧教材或fixtures当课程。
- 基础课在/learn逐步长成demo，不跳入/project另一个实践专栏。W01没有API服务，首应用从F04开始。
- 源码先发布提交/检查点，页面manifest按各sourceRef固定40位SHA/hash；不回退main或工作文件；读者无需Git/在线demo。

## Current Risks

- 真实初学者/PyCharm跟做、完整浏览器禁JS未完成；SSR默认正文/代码/SVG已验证，不夸大学习效果。
- Windows作者3.12.4实测；3.12.10仅安装入口。POSIX本地只语法检查，CI新增完整安装，结果另确认。
- 本机npm用户配置冲突可用--userconfig=NUL命令级覆盖，不改全局设置。
- 本地生产3000与预览3001已重新启动。重建前核对监听PID和命令身份再停止，避免Windows文件锁。

## Last Interaction

- 用户要求按目录正式写作，从简单到难、短代码/注释/包/美观图/独立章，不一次写全课，写完认真核查。

## Continue From

- W02：F04解释FastAPI导入、对象创建/赋值、路由登记与完整函数；F05真实HTTP运行；F06调试/恢复，不先引入数据库或身份。
- 长期TaskBoard API：内存→组织→同步SQLite/身份M4→异步PG→客户端/附件/观测→Docker/恢复M7；F37选读背景任务不承诺可靠队列。
