import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/docs-shell";
import { CopyPageButton, DocsAccordion, DocsSection } from "@/components/docs/document-primitives";
import { fastapiChapters, chapterHref, findFastapiChapter } from "@/content/fastapi/course";
import { siteSearchEntries } from "@/content/site";
import HttpRequestResponse, * as http from "@/content/fastapi/chapters/http-request-response";
import EnvironmentAndProjectRoot, * as environment from "@/content/fastapi/chapters/environment-and-project-root";
import PythonForApi, * as python from "@/content/fastapi/chapters/python-for-api";
import { materializeLesson } from "@/lib/course/materialize";
import { exportDocumentText } from "@/lib/framework/document-export";
import { getSourceLinks } from "@/lib/course/sources";

const lessons = {
  "http-request-response": { render: HttpRequestResponse, ...http },
  "environment-and-project-root": { render: EnvironmentAndProjectRoot, ...environment },
  "python-for-api": { render: PythonForApi, ...python },
};

export const dynamicParams = false;
export function generateStaticParams() { return fastapiChapters.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const chapter = findFastapiChapter((await params).slug);
  return { title: chapter?.title ?? "章节未发布", description: chapter?.summary };
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = findFastapiChapter(slug);
  if (!chapter) notFound();
  const lesson = lessons[chapter.slug];
  const body = await materializeLesson(lesson.render());
  const targets = [...lesson.targets, { id: "source-and-next", title: "源码与下一步", level: 2 as const }];
  const text = `${chapter.title}\n\n${lesson.introduction}\n\n${exportDocumentText(body, {excludeTypes:[DocsAccordion]})}`;
  const source = getSourceLinks(chapter.source);
  const index = fastapiChapters.findIndex(item => item.id === chapter.id);
  const previous = fastapiChapters[index - 1];
  const next = fastapiChapters[index + 1];
  return <DocsShell section="learn" title={chapter.title} targets={targets} searchEntries={siteSearchEntries}>
    <div className="docs-breadcrumb"><Link href="/learn">FastAPI 教程</Link> / 入门准备 / {chapter.id}</div>
    <div className="docs-page-heading"><h1>{chapter.title}</h1><CopyPageButton text={text} /></div>
    <div className="docs-prose docs-intro"><p>{lesson.introduction}</p></div>
    {body}
    <DocsSection id="source-and-next" title="源码与下一步">
      <p><a href={source.tree} target="_blank" rel="noreferrer">本章完整源码 ↗</a> · <a href={source.file} target="_blank" rel="noreferrer">当前文件 ↗</a></p>
      <p>各代码框均标明对应文件和行号。回到本章固定版本，可以恢复练习起点；图中的流程是帮助理解机制的示意。</p>
      <p className="docs-caption">学习组织参考 <a href="https://docs.langchain.com/oss/python/langchain/quickstart" target="_blank" rel="noreferrer">LangChain 文档</a>及其<a href="https://github.com/langchain-ai/docs" target="_blank" rel="noreferrer">官方仓库</a>；接口知识依据 <a href="https://fastapi.tiangolo.com/tutorial/" target="_blank" rel="noreferrer">FastAPI 官方教程</a>。</p>
      {!next && <p>本批到这里结束。下一批将创建第一个 FastAPI 应用，并运行真正的 HTTP 请求。</p>}
    </DocsSection>
    <nav className="docs-lesson-pagination" aria-label="章节翻页">
      <Link href={previous ? chapterHref(previous.slug) : "/learn"}><span>← 上一页</span><strong>{previous?.title ?? "课程概览"}</strong></Link>
      {next && <Link href={chapterHref(next.slug)}><span>下一章 →</span><strong>{next.title}</strong></Link>}
    </nav>
  </DocsShell>;
}
