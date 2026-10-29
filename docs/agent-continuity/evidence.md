# Evidence

## Recent

- file: 最新展示改造见reading-refresh.md及官方code-reading-audit.json：28前端检查/build/typecheck/双模式路由通过；纯代码结构、源/hash不变、桌面手机/双主题、201字符复制匹配验证；LC-DOCS-2.1更新。

- cmd: Python3.12.4干净Windows环境实际执行windows.ps1，pip安装14包锁、pip check/导入成功，错目录/解释器失败后恢复；9个unittest通过，详见fastapi-w01-labs.json。
- cmd: npm --userconfig=NUL run setup/build/typecheck/build:framework完成；最终23测试全部通过、三章SSG成功；命令级配置覆盖只解决本机npm冲突。
- cmd: node scripts/verify-site.mjs及--preview均pass，8正式页面200、F04/旧课404、预览按构建开关开放，106本地字体/页面资源存在。
- manual: Chrome1440×960/390×844、浅/深主题、SVG无节点文字溢出、代码横滚、搜索Enter到F03、HTTP片段复制与源相符；36个源码区间与教材交叉审阅。空Git仓库浅取tag/错误SHA拒绝/私有refs清理通过。
- file: 源A739a064与tag、页面B f7f63dd均已推送；[CI40864156475](https://github.com/ban-code-art/ai-engineering-roadmap/actions/runs/40864156475) 的web与labs、Linux完整安装均success。fastapi-w01-review.md/diagrams.md与UI截图记录本批，后续尚无API/demo。

## Historical

- FA-CURRICULUM-1.0已规划8区/42独立章/41主线1选读/M0–M7和16小批次；官方来源与前置审阅仍保留，规划不等于实施。
- 四课程共享框架、字体许可与LangChain参考在docs/evidence/langchain-reference；旧教材未恢复。

## Known Gaps

- 无真实初学者/PyCharm参与者，不声称教学效果通过。
- 完整浏览器关闭JavaScript未核查；默认阅读以SSR/HTML/原生details验证，保留浏览器验收。
- Linux完整安装CI已通过；macOS本地只有语法检查，Windows3.12.10补丁未实际复测。
- W01只读HTTP示意和普通Python实验；API、数据库/身份/部署等后续实施。
