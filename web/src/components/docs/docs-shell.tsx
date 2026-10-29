"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "./search-dialog";
import { TableOfContents } from "./table-of-contents";
import { sections, sitePages, sidebarGroups, siteInfo, type SiteSection, type SiteSidebarGroup } from "@/content/site";
import type { DocTarget, SearchEntry } from "@/lib/framework/types";

const previewGroups: SiteSidebarGroup[] = [
  { title: "开始使用", links: [{ title: "框架概览", href: "#introduction" }, { title: "排版与阅读", href: "#typography" }] },
  { title: "文档组件", links: [{ title: "代码与版本", href: "#code" }, { title: "操作命令", href: "#commands" }, { title: "提示与展开", href: "#callouts" }] },
  { title: "图与文件", links: [{ title: "文件目录", href: "#files" }, { title: "请求流程", href: "#flow" }] },
  { title: "验收", links: [{ title: "验证与来源", href: "#verification" }] },
];

type Theme = "system" | "light" | "dark";

export interface DocsShellProps {
  children: ReactNode;
  targets: DocTarget[];
  searchEntries: SearchEntry[];
  section?: SiteSection | "preview";
  title?: string;
}

/** Shared reading layout for every public section and the internal component preview. */
export function DocsShell({ children, targets, searchEntries, section = "preview", title }: DocsShellProps) {
  const pathname = usePathname();
  const frame = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const themeMenu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const drawerOverflow = useRef<string | null>(null);
  const drawerScroll = useRef<number | null>(null);
  const drawerReturnFocus = useRef(true);
  const [theme, setTheme] = useState<Theme>("system");
  const [active, setActive] = useState(targets[0]?.id ?? "");
  const isPreview = section === "preview";
  const currentSection = sitePages.find((item) => item.id === section);
  const currentPath = pathname ?? currentSection?.href ?? "/framework-preview";
  const currentTitle = title ?? currentSection?.title ?? "框架概览";
  const groups = isPreview ? previewGroups : sidebarGroups[section];

  const restoreDrawer = useCallback(() => {
    if (drawerOverflow.current !== null) {
      document.body.style.overflow = drawerOverflow.current;
      drawerOverflow.current = null;
    }
    if (drawerScroll.current !== null) {
      window.scrollTo({ top: drawerScroll.current, behavior: "instant" });
      drawerScroll.current = null;
    }
  }, []);

  const restoreFocus = useCallback(() => {
    // Opening search closes the drawer first; its queued close event must not
    // move focus back out of the new modal.
    if (drawerReturnFocus.current && !frame.current?.querySelector("dialog[open]")) {
      trigger.current?.focus({ preventScroll: true });
    }
  }, []);

  const closeMenu = useCallback((returnFocus = true) => {
    drawerReturnFocus.current = returnFocus;
    menu.current?.close();
    restoreDrawer();
    restoreFocus();
  }, [restoreDrawer, restoreFocus]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("docs-framework-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
    return () => restoreDrawer();
  }, [restoreDrawer]);

  useEffect(() => {
    const update = () => {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch {}
      setActive(targets.find((target) => target.id === id)?.id ?? targets[0]?.id ?? "");
    };
    update();
    if (menu.current?.open) closeMenu(false);
    themeMenu.current?.removeAttribute("open");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [pathname, targets, closeMenu]);

  useEffect(() => {
    const element = frame.current;
    const closeForSearch = () => {
      themeMenu.current?.removeAttribute("open");
      if (menu.current?.open) closeMenu(false);
    };
    const closeThemeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !themeMenu.current?.contains(event.target)) {
        themeMenu.current?.removeAttribute("open");
      }
    };
    const closeThemeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && themeMenu.current?.open) {
        themeMenu.current.removeAttribute("open");
        themeMenu.current.querySelector("summary")?.focus();
      }
    };
    element?.addEventListener("docs-search-opening", closeForSearch);
    document.addEventListener("pointerdown", closeThemeOutside);
    document.addEventListener("keydown", closeThemeOnEscape);
    return () => {
      element?.removeEventListener("docs-search-opening", closeForSearch);
      document.removeEventListener("pointerdown", closeThemeOutside);
      document.removeEventListener("keydown", closeThemeOnEscape);
    };
  }, [closeMenu]);

  function changeTheme(value: Theme) {
    setTheme(value);
    try {
      if (value === "system") localStorage.removeItem("docs-framework-theme");
      else localStorage.setItem("docs-framework-theme", value);
    } catch {}
  }

  function openMenu() {
    if (!menu.current || menu.current.open) return;
    themeMenu.current?.removeAttribute("open");
    drawerReturnFocus.current = true;
    drawerScroll.current = window.scrollY;
    drawerOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current.showModal();
  }

  function isCurrentLink(href: string) {
    const [path, id] = href.split("#");
    if (id) return (path === "" || path === currentPath) && active === id;
    return path === currentPath;
  }

  function isSamePageAnchor(href: string) {
    const [path, id] = href.split("#");
    return Boolean(id) && (path === "" || path === currentPath);
  }

  function followSidebarLink() {
    frame.current?.querySelectorAll<HTMLDetailsElement>(".docs-scope[open]").forEach((details) => { details.open = false; });
    if (menu.current?.open) closeMenu(false);
  }

  const sidebar = <>
    <details className="docs-scope">
      <summary><span aria-hidden="true">◈</span> {isPreview ? "框架样例" : siteInfo.subtitle}<span className="docs-chevron" aria-hidden="true">⌄</span></summary>
      <div>
        <p>{isPreview ? "用于验收文档组件。" : "基础教程与项目实践共用这套文档模板。"}</p>
        <Link href="/" onClick={followSidebarLink}>查看路线概览 ↗</Link>
      </div>
    </details>
    <nav aria-label={isPreview ? "框架页面导航" : "学习路线导航"} className="docs-page-nav">
      {groups.map((group) => <div className="docs-nav-group" key={group.title}>
        <h3>{group.title}</h3>
        {group.links.map((item) => isSamePageAnchor(item.href)
          ? <a key={item.href} href={item.href} aria-current={isCurrentLink(item.href) ? "page" : undefined} onClick={followSidebarLink}>{item.title}</a>
          : <Link key={item.href} href={item.href} aria-current={isCurrentLink(item.href) ? "page" : undefined} onClick={followSidebarLink}>{item.title}</Link>)}
      </div>)}
    </nav>
    <div className="docs-sidebar-foot">
      <a href={siteInfo.repositoryUrl} target="_blank" rel="noreferrer">GitHub 源码<span aria-hidden="true">↗</span></a>
      <p>{isPreview ? "内部预览 · 不计入学习进度" : "内容待编写"}</p>
    </div>
  </>;

  return <div ref={frame} className="docs-frame" data-docs-theme={theme} data-docs-section={section}>
    <a className="docs-skip" href="#docs-content">跳到正文</a>
    <header className="docs-navbar">
      <div className="docs-topline">
        <Link href="/" className="docs-logo" aria-label={`${siteInfo.name} 学习路线`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 1 3 13h7l-1 10 12-14h-8l1-8Z" /></svg>
          <strong>AI <span>Engineering</span></strong>
        </Link>
        <span className="docs-product-label">{siteInfo.subtitle}</span>
        <SearchDialog entries={searchEntries} />
        <div className="docs-header-actions">
          <a href={siteInfo.repositoryUrl} className="docs-existing-link" target="_blank" rel="noreferrer">GitHub ↗</a>
          <details ref={themeMenu} className="docs-theme-menu">
            <summary aria-label="选择主题">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></svg>
            </summary>
            <div role="group" aria-label="主题选项">
              {([['system', '跟随系统'], ['light', '浅色'], ['dark', '深色']] as const).map(([value, label]) =>
                <button type="button" key={value} aria-pressed={theme === value} onClick={(event) => {
                  changeTheme(value);
                  event.currentTarget.closest("details")?.removeAttribute("open");
                }}>{label}{theme === value && <span aria-hidden="true">✓</span>}</button>)}
            </div>
          </details>
        </div>
      </div>
      <nav className="docs-product-nav" aria-label="栏目">
        {sections.map((item) => <Link key={item.id} href={item.href} aria-current={section === item.id ? "page" : undefined}>{item.title}</Link>)}
      </nav>
      <div className="docs-mobile-path">
        <button ref={trigger} type="button" onClick={openMenu} aria-label="打开导航" aria-haspopup="dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span>{isPreview ? "文档组件" : siteInfo.subtitle}</span>
        </button>
        <span aria-hidden="true">›</span><strong>{currentTitle}</strong>
      </div>
    </header>
    <div className="docs-body">
      <aside className="docs-sidebar">{sidebar}</aside>
      <div className="docs-main-container">
        <aside className="docs-toc-column"><TableOfContents targets={targets} /></aside>
        <main id="docs-content" className="docs-content" tabIndex={-1}>
          <details className="docs-inline-toc">
            <summary>本页目录</summary>
            <ol>{targets.filter((target) => target.level === 2).map((target) => <li key={target.id}>
              <a href={`#${target.id}`} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>{target.title}</a>
            </li>)}</ol>
          </details>
          {children}
          <footer className="docs-footer">
            <div><strong>{siteInfo.name}</strong><p>学习路线 · 内容待编写</p></div>
            <nav aria-label="页尾">
              <Link href="/learn">FastAPI 教程 ↗</Link>
              <Link href="/project">FastAPI 项目实战 ↗</Link>
              <Link href="/project/langchain">LangChain 项目实战 ↗</Link>
              <Link href="/project/rag">RAG 项目实战 ↗</Link>
              <a href={siteInfo.repositoryUrl} target="_blank" rel="noreferrer">GitHub 源码 ↗</a>
            </nav>
          </footer>
        </main>
      </div>
    </div>
    <dialog ref={menu} className="docs-mobile-drawer" aria-label="学习路线导航"
      onCancel={(event) => { event.preventDefault(); closeMenu(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX > rect.right || event.clientX < rect.left || event.clientY > rect.bottom || event.clientY < rect.top) closeMenu();
      }}
      onClose={() => { restoreDrawer(); restoreFocus(); }}>
      <div className="docs-drawer-content">
        <div className="docs-drawer-header"><strong>{siteInfo.name}</strong><button type="button" onClick={() => closeMenu()} aria-label="关闭导航">×</button></div>
        {sidebar}
      </div>
    </dialog>
  </div>;
}
