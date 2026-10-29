format: resume-project-context/v1

# Intent

## Requested Outcome

- 当前按用户要求将顶部分类改为FastAPI教程、FastAPI项目实战、LangChain项目实战、RAG项目实战，同步课程入口/搜索/侧栏并更新仓库。旧教材继续不保留，新内容后续编写。

## Scope

- 移除旧前端、教材、教学业务源码和VitePress工具链；保留统一React/Next模板、设计/写作规范、官方参考与本地字体。
- 默认首页/基础/项目入口同模板；独立组件fixtures替代旧首接口依赖；验证并创建初始提交上传。

## Non-Goals

- 本轮不编写新教程，不迁移旧教材，不部署公网，不恢复github.io或MDX学习解析。

## Constraints

- 旧材料移出当前项目，不进入Git历史或上传内容。
- 两类教程只切换内容/栏目数据，不引入另一套shell/CSS。
- 字体保持OFL来源；Manrope标题替代受限TWK，记录差异。

## Success Criteria

- 构建/类型/框架测试通过，三条正式入口同模板，旧课404，预览开关有效。
- 上传内容无旧教程、旧业务、生成器、凭据、本地运行数据或依赖/构建缓存。
- main成功上传到用户指定仓库并核对远程提交。
