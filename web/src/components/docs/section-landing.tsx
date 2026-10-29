import Link from "next/link";
import { DocsShell } from "./docs-shell";
import { DocsCallout, DocsSection } from "./document-primitives";
import { sectionTargets, sections, sitePages, siteInfo, siteSearchEntries, type SiteSection } from "@/content/site";
import { FastapiLanding } from "./fastapi-landing";

const introductions: Record<SiteSection, string> = {
  overview: "这里整理 AI 工程课程教学与项目实战，包括 FastAPI 教程，以及 FastAPI、LangChain 和 RAG 项目实战。各课程共用同一套文档模板。",
  learn: "FastAPI 教程将从必要前置和第一个接口开始，逐步讲清后端开发。正式内容待重新编写。",
  project: "FastAPI 项目实战将围绕完整后端项目逐步展开。正式内容待编写，沿用统一文档模板。",
  "langchain-project": "LangChain 项目实战面向大模型应用开发。正式内容待编写，沿用统一文档模板。",
  "rag-project": "RAG 项目实战面向检索增强生成应用。正式内容待编写，沿用统一文档模板。",
};

/** An honest section entry, ready for future authored content in the shared layout. */
export function SectionLanding({ section }: { section: SiteSection }) {
  if (section === "learn") return <FastapiLanding />;
  const current = sitePages.find((item) => item.id === section)!;
  const title = section === "overview" ? siteInfo.subtitle : current.title;

  return <DocsShell section={section} title={title} targets={sectionTargets[section]} searchEntries={siteSearchEntries}>
    <div className="docs-breadcrumb">{siteInfo.name} · {siteInfo.subtitle}</div>
    <div className="docs-page-heading"><h1>{title}</h1></div>
    <div className="docs-prose docs-intro"><p>{introductions[section]}</p></div>
    <DocsCallout kind="note" title={section === "overview" ? "当前编写进度" : "内容待编写"}>
      <p>FastAPI 教程已发布入门准备三章。其他项目实践内容将逐步编写。</p>
    </DocsCallout>
    <DocsSection id="writing-status" title="编写状态">
      {section === "overview" ? <><p>先从 FastAPI 教程开始，逐步建立接口与后端基础。</p>
        <ul>{sections.map(course=><li key={course.id}><Link href={course.href}>{course.title}</Link> · {course.id==="learn"?"已发布 3 章":"内容待编写"}</li>)}</ul></>
        : <p>内容待编写。当前没有已发布的{current.title}章节。</p>}
    </DocsSection>
    <DocsSection id="authoring" title="后续编写方式">
      <p>各课程共用同一套文档模板，分别维护教学内容。后续将保持连续阅读，按需加入代码、图形和验证说明。</p>
      {section !== "overview" && <p>需要先学习接口与后端基础时，可前往<Link href="/learn">FastAPI 教程</Link>。</p>}
    </DocsSection>
  </DocsShell>;
}
