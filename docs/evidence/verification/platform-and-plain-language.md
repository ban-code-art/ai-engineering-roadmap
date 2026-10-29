# Windows 命令与通俗讲解补充

日期：2026-10-29。范围：已发布F01–F03及全局教学规范，不编写后续章节，不修改教学源码。

- F02的7组操作与F03的5组运行命令都有明确的“Windows · PowerShell / macOS · Linux”框外标签，默认Windows。切换时读取各自固定源文件的真实行，Python文件保持单一来源。
- Windows入口明确Windows Terminal选择PowerShell，不混cmd或Git Bash；工作目录、解释器入口、脚本路径和关键参数在正文交代。F02补充管道符的含义。
- 默认整页导出包含Windows系统标签与命令，其他系统保留无JS的原生展开备选；每组局部状态独立，复制当前组真实代码。
- F01增加点餐与商场柜台类比；F02增加房间/相对定位、独立工具箱、pip领取工具类比；F03增加配方/调用、联系人记录/购物清单、共用配方模块、类型标签类比。各例均回到技术机制，保持导入顶层执行/返回与打印不同/普通注解不自动验证的边界。
- DESIGN.md、writing-standard.md、frontend-page-design.md（LC-DOCS-2.2）与AGENTS.md同步长期要求：专业名词与准确定义→白话解释→必要生活例子/映射→代码输入处理结果→类比边界与回讲。2.1的纯代码与配色继续保留。

## 验证

- 29项前端检查、生产/内部预览构建与typecheck通过，包含Windows默认标签、POSIX原生备选、对应源命令及默认Windows文本导出。
- Chrome桌面1440×960实际显示Windows命令；用左右方向键切换时源码链接对应windows.ps1/posix.sh，其他命令组保持Windows默认。
- 复制Windows运行命令55字符与固定源码一致。截图见[Windows命令入口](platform-and-plain-language/windows-desktop.png)。
- 独立交叉审阅核对12组行区间和生活类比，修正“Mac/Linux只改解释器路径”为“解释器入口和路径写法”，避免忽略路径分隔符。
- 教学源和manifest未变，之前Windows/Linux完整运行证据继续适用。本次新增手机浏览器核查因连接中断未完成，不把桌面结果当手机实测；原生SSR/同一响应式组件检查通过。
- 提交988c0a6592036d433559f753de86245012be9505已推送；[CI40873591725](https://github.com/ban-code-art/ai-engineering-roadmap/actions/runs/40873591725)的web与labs全部通过。
