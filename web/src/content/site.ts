import type { DocTarget, SearchEntry } from "@/lib/framework/types";

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
  { id: "learn", title: "FastAPI 教程", href: "/learn", description: "FastAPI 基础教程将重新编写，循序渐进地学习接口与后端开发。" },
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
  overview:targetsFor(),learn:targetsFor(),project:targetsFor(),
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
  learn: sidebarFor("learn"),
  project: sidebarFor("project"),
  "langchain-project": sidebarFor("langchain-project"),
  "rag-project": sidebarFor("rag-project"),
};

/** Search covers actual course entry pages, without unpublished lesson chapters. */
export const siteSearchEntries: SearchEntry[] = sitePages.map(({ id, title, href, description }) => ({
  id: `site-${id}`,
  title,
  section: id === "overview" ? siteInfo.subtitle : "课程教学",
  summary: description,
  href,
}));
