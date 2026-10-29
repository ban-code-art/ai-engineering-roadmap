import Link from "next/link";
import { DocsShell } from "./docs-shell";
import { DocsCallout, DocsSection } from "./document-primitives";
import { sectionTargets, sections, siteInfo, siteSearchEntries, type SiteSection } from "@/content/site";

const introductions: Record<SiteSection, string> = {
  overview: "这里整理 AI 工程学习路线，首批内容从 FastAPI 开始。基础教程与项目实践使用同一套文档模板。",
  learn: "基础教程的入口已建立。正式内容待编写，后续将使用当前文档模板持续补充。",
  project: "项目实践的入口已建立。正式内容待编写，与基础教程共用当前文档模板。",
};

/** An honest section entry, ready for future authored content in the shared layout. */
export function SectionLanding({ section }: { section: SiteSection }) {
  const current = sections.find((item) => item.id === section)!;
  const title = section === "overview" ? siteInfo.subtitle : current.title;

  return <DocsShell section={section} title={title} targets={sectionTargets[section]} searchEntries={siteSearchEntries}>
    <div className="docs-breadcrumb">{siteInfo.name} · {siteInfo.subtitle}</div>
    <div className="docs-page-heading"><h1>{title}</h1></div>
    <div className="docs-prose docs-intro"><p>{introductions[section]}</p></div>
    <DocsCallout kind="note" title="内容待编写">
      <p>当前保留路线入口与文档框架，教程和项目内容将重新编写。</p>
    </DocsCallout>
    <DocsSection id="writing-status" title="编写状态">
      {section === "overview" ? <p><Link href="/learn">基础教程</Link>与<Link href="/project">项目实践</Link>均处于内容待编写状态，当前没有已发布的教程或项目章节。</p>
        : <p>内容待编写。当前没有已发布的{current.title}章节。</p>}
    </DocsSection>
    <DocsSection id="authoring" title="后续编写方式">
      <p>基础教程与项目实践沿用同一套文档模板。后续内容将保持连续阅读，按需加入代码、图形和验证说明。</p>
      {section === "learn" && <p>需要查看另一类内容的编写状态，可前往<Link href="/project">项目实践</Link>。</p>}
      {section === "project" && <p>需要查看基础内容的编写状态，可前往<Link href="/learn">基础教程</Link>。</p>}
    </DocsSection>
  </DocsShell>;
}
