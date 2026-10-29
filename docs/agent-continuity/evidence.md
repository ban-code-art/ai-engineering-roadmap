# Evidence

## Recent (last 3-5 verifications or current milestone)

- cmd: `cd web; npm run build`与`npm run build:framework`：均exit0，15项框架测试通过，正式/预览standalone分别产生；平台探针与typecheck通过。
- cmd: `node scripts/verify-site.mjs`及`--preview`：三条入口200且同DocsShell，旧首接口/未编写阶段404，默认预览404/显式预览200，106本地字体存在。
- manual: Chrome对照基础/项目默认页面共享模板，截图及测量在docs/evidence/verification；没有发布旧教程或假章节。
- file: `web/src/content/site.ts`：统一栏目导航；web/fixtures是新组件测试素材，无旧教程依赖；docs/planning/frontend-page-design.md是LC-DOCS-2.0。
- cmd: `git push -u origin main`成功，`git ls-remote origin refs/heads/main`与本地5802aee1355c9216e93cdcacfbdc890aaa2ce458一致；旧教材/旧教学源码不在初始树。上传内容检查见cleanup-upload-audit.json。
- gap: 新教程未编写，禁用JS浏览器/学习者/PyCharm/完整部署等不由本轮框架结果代替.

## Historical (milestone evidence only)

- LangChain官方配置/页面测量与字体来源保存在docs/evidence/langchain-reference；只证明对应日期的事实。

## Known Gaps

- 新教学内容、真实Python/HTTP教学行为与学习者跟做待从零设计及验证。
- 完整禁用JS浏览器、Node24本地和远程部署待验收，标题精确TWK字形不在当前授权资源中。
