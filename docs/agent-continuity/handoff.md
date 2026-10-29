# Handoff

## Snapshot

- Goal: 规划FastAPI基础教程的渐进知识路线，最终完整版TaskBoard API demo；先设计，不写教程代码。
- Progress: FA-CURRICULUM-1.0已完成8区/42独立章/41主线1选读/M0–M7与16写作批次；各章前置/概念/操作/图/源码发布规则已审阅，159实现文件不变。
- Next: W01起点三章的小节设计与素材准备，之后W02首接口校准；实际正文/源码实施需跟随后续用户指令。

## Read First

- DESIGN.md唯一入口；docs/planning/fastapi-curriculum.md唯一FastAPI课程脉络。
- frontend-page-design.md负责LangChain模板/独立章节页与连续页内小节；writing-standard.md负责解释与源码/图规范。
- fastapi-curriculum-review.json与sources.json是证据，不是另一个课程方案。

## Do Not Change

- 本轮仅课程结构，不改web实现/导航/页面，不写Python或恢复旧课程，规划中的源码路径不能生成假GitHub链接。
- 当前属于 /learn 的FastAPI教程；结课demo在本课成长，不跳到 /project 企业项目专栏。
- 一章一页，正文全部小节连续；首次概念就地解释，图与代码来自本步真实版本。

## Current Risks

- 全部42章尚未编写。章节数/架构图/计划功能不等于已运行或学习通过。
- 官方SQL数据库教程当前用SQLModel，本课选SQLAlchemy需明确工具补课；同步M4完成后再异步PG，不提前Docker。
- 源码先发布提交/检查点ref，页面后用manifest各sourceRef固定SHA；浅克隆缺对象不得回退main/工作树，取源失败阻止课程build。
- 标题Manrope与TWK是明确字族差异；字体授权/模板既有记录继续保留。
- Git有main与origin，课程设计可同步，不重初始化或强推。

## Last Interaction

- 用户要求FastAPI基础到企业工程实践的渐进课程，最终完整demo，但当前只分区/目录/分章理清脉络；要认真绘图、逐概念解释和GitHub源码跳转，不把全课糅合一页。

## Continue From

- A区F01只读HTTP示意，F02环境/目录，F03必要Python；F04解释FastAPI导入/对象/完整路由，F05才真实HTTP闭环。
- 项目主线TaskBoard API：内存→组织→同步SQLite/身份M4→异步PG→客户端/附件/观测→Docker/恢复M7；F37后台任务为选读，不成为可靠队列承诺。
