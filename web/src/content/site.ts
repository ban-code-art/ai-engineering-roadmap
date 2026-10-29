import type { DocTarget, SearchEntry } from "@/lib/framework/types";
import { fastapiChapters, chapterHref } from "./fastapi/course";

export type SiteSection = "overview" | "learn" | "project" | "langchain-project" | "rag-project";

export interface SiteSectionInfo {
  id: SiteSection;
  title: string;
  href: string;
  description: string;
}

export interface SiteSidebarGroup {
  title: string;
  links: { title: string; href: string }[];
}

export const siteInfo = {
  name: "AI Engineering",
  subtitle: "学习路线",
  repositoryUrl: "https://github.com/ban-code-art/ai-engineering-roadmap",
} as const;

/** Every public navigation item points to an existing, published route. */
export const sections: SiteSectionInfo[] = [
  { id: "learn", title: "FastAPI 教程", href: "/learn", description: "从 HTTP、Python 环境和必要语法开始，循序渐进地搭建完整 FastAPI demo。" },
  { id: "project", title: "FastAPI 项目实战", href: "/project", description: "FastAPI 项目实战内容待编写，沿用统一文档模板。" },
  { id: "langchain-project", title: "LangChain 项目实战", href: "/project/langchain", description: "LangChain 项目实战内容待编写，面向大模型应用开发。" },
  { id: "rag-project", title: "RAG 项目实战", href: "/project/rag", description: "RAG 项目实战内容待编写，面向检索增强生成应用。" },
];

/** The home page remains reachable through the brand and sidebar, not a course tab. */
export const sitePages: SiteSectionInfo[] = [
  { id: "overview", title: "路线概览", href: "/", description: "AI 工程课程教学与项目实战的编写状态。" },
  ...sections,
];

function targetsFor(): DocTarget[] {
  return [
    {id:"writing-status",title:"编写状态",level:2},
    {id:"authoring",title:"后续编写方式",level:2},
  ];
}
export const sectionTargets: Record<SiteSection, DocTarget[]> = {
  overview:targetsFor(),learn:[{id:"start-here",title:"从这里开始",level:2},{id:"course-path",title:"后续学习路线",level:2},{id:"how-to-learn",title:"怎样跟着学习",level:2}],project:targetsFor(),
  "langchain-project":targetsFor(),"rag-project":targetsFor(),
};

function sidebarFor(section: SiteSection): SiteSidebarGroup[] {
  const current = sitePages.find((item) => item.id === section)!;
  return [
    { title: "课程教学", links: sitePages.map(({ title, href }) => ({ title, href })) },
    {
      title: current.title,
      links: sectionTargets[section].map(({ id, title }) => ({ title, href: `${current.href}#${id}` })),
    },
  ];
}

/** Both tutorial and practice pages use the same sidebar structure. */
export const sidebarGroups: Record<SiteSection, SiteSidebarGroup[]> = {
  overview: sidebarFor("overview"),
  learn: [
    { title: "FastAPI 教程", links: [{title:"课程概览",href:"/learn"}] },
    { title: "入门准备", links: fastapiChapters.map(chapter => ({title:chapter.title,href:chapterHref(chapter.slug)})) },
    { title: "项目实践", links: sections.filter(section=>section.id!=="learn").map(({title,href})=>({title,href})) },
  ],
  project: sidebarFor("project"),
  "langchain-project": sidebarFor("langchain-project"),
  "rag-project": sidebarFor("rag-project"),
};

/** Search covers actual course entry pages, without unpublished lesson chapters. */
export const siteSearchEntries: SearchEntry[] = [...sitePages.map(({ id, title, href, description }) => ({
  id: `site-${id}`,
  title,
  section: id === "overview" ? siteInfo.subtitle : "课程教学",
  summary: description,
  href,
})), ...fastapiChapters.map(chapter => ({id:`fastapi-${chapter.id}`,title:chapter.title,section:"FastAPI 教程 · 入门准备",summary:chapter.summary,href:chapterHref(chapter.slug)}))];
