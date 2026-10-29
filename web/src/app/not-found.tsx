import Link from "next/link";
import { DocsShell } from "@/components/docs/docs-shell";
import { getSearchEntries } from "@/lib/framework/registry";

export default function NotFound() {
  return (
    <DocsShell section="overview" title="页面未找到" targets={[]} searchEntries={getSearchEntries(false)}>
      <div className="docs-breadcrumb">404</div><h1>页面尚未编写</h1>
      <div className="docs-prose docs-intro"><p>旧教程已移除，新内容将重新编写。基础教程和项目实践共用统一文档模板。</p>
      <p><Link href="/">返回知识库首页 →</Link></p></div>
    </DocsShell>
  );
}
