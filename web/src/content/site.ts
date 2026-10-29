import type { DocTarget, SearchEntry } from "@/lib/framework/types";

export type SiteSection = "overview" | "learn" | "project";

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
  { id: "overview", title: "路线概览", href: "/", description: "学习路线与内容编写状态。" },
  { id: "learn", title: "基础教程", href: "/learn", description: "基础教程内容待编写，首批内容从 FastAPI 开始。" },
  { id: "project", title: "项目实践", href: "/project", description: "项目实践内容待编写，与基础教程共用文档模板。" },
];

export const sectionTargets: Record<SiteSection, DocTarget[]> = {
  overview: [
    { id: "writing-status", title: "编写状态", level: 2 },
    { id: "authoring", title: "后续编写方式", level: 2 },
  ],
  learn: [
    { id: "writing-status", title: "编写状态", level: 2 },
    { id: "authoring", title: "后续编写方式", level: 2 },
  ],
  project: [
    { id: "writing-status", title: "编写状态", level: 2 },
    { id: "authoring", title: "后续编写方式", level: 2 },
  ],
};

function sidebarFor(section: SiteSection): SiteSidebarGroup[] {
  const current = sections.find((item) => item.id === section)!;
  return [
    { title: "学习路线", links: sections.map(({ title, href }) => ({ title, href })) },
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
};

/** Search describes the three real entry pages, without unpublished lessons. */
export const siteSearchEntries: SearchEntry[] = sections.map(({ id, title, href, description }) => ({
  id: `site-${id}`,
  title,
  section: siteInfo.subtitle,
  summary: description,
  href,
}));
