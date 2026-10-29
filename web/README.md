# Web文档框架

基础教程(`/learn`)与项目实践(`/project`)使用同一个DocsShell和全站样式；当前内容待重新编写。没有legacy外壳、旧课或教程业务源码依赖。

## 运行

```powershell
npm.cmd ci
npm.cmd run dev
```

默认开发/生产监听127.0.0.1:3000。`build`生成standalone并复制public/static资源，`start`启动；`PORT`可修改生产端口。

显式`build:framework`/`start:framework`打开3001/framework-preview，输出.next-framework，默认构建预览404。重建前停止对应服务，避免Windows目录占用。

## 检查

- `test:framework`：注册/检索/hash白名单、连续目录SSR、局部代码组与文档导出。
- `check:platform`：真实包入口/高亮与直接版本锁。
- `build`、`typecheck`：正式构建与类型。
- `verify:site`：服务启动后检查共享模板、有效路由、旧课404、资源与字体。
- `node scripts/verify-site.mjs --preview`：检查显式3001预览与独立fixtures。

`src/content/site.ts`维护有效栏目，未编写章节不加入导航。未来内容使用相同文档组件，不新建另一套项目主题。

字体本地分发，OFL许可证随public/fonts交付；Manrope标题替代受限TWK，字形差异明确记录。内部样例来自fixtures，所有源码/hash与文件位置都是真实组件素材，不能标为课程完成。
