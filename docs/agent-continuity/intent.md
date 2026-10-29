format: resume-project-context/v1

# Intent

## Requested Outcome

- 用户现已授权按照 FA-CURRICULUM-1.0 编写教程，分批从简单到困难，逐概念解释、短代码、包说明、认真绘图，写完核查；长期结尾完成 TaskBoard API demo。

## Scope

- 当前批次 W01：F01 HTTP 请求与响应、F02 环境与项目根、F03 必要 Python，三个独立 /learn/fastapi 页面。
- 最新补充要求：Windows命令明确可见；专业术语同时配白话与必要生活例子，写入全局设计且后续章节沿用。
- 本轮只整理长期规范：页面/代码/命令/类比/源码/图/逐批审阅明确归档，AGENTS自动读取，后续即使用户不再提及也遵循；不新增教程或修改运行实现。
- 官方知识依据与LangChain文档组织、每章概念解释/操作/配图/源码计划、固定GitHub链接/恢复规则、小批次写作顺序。
- 同步设计入口/职责/接续与设计审阅证据。

## Non-Goals

- 当前批次不写 F04–F42、完整 demo 或其他课程，不恢复旧课。
- 不是顶部FastAPI项目实战专栏，不扩为SSO、多租户、队列或微服务企业业务系统。

## Constraints

- 一章一页、章内连续小节，全部课程不能混一页；统一LangChain风格模板。
- 新概念首次就地解释，app=FastAPI()、参数、class、Depends、yield/Session/await不能隐藏前提。
- 源码链接只有真实源运行/推送后开放，各步骤/恢复源各自固定SHA/hash；每章图有因果与视觉验收，组件演示不冒充教材图。

## Success Criteria

- W01 三章独立可读；源码在新环境验证、先推送提交，再由固定 SHA/hash 提取到页面。
- 构建拒绝缺失对象、路径越界、hash/行号错误；页面在桌面/手机与无JS模式保持默认正文、代码和图。
- 作者运行、自动检查、人工审阅与真实初学者跟做分开记录，不夸大教学验收。
