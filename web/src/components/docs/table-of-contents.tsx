"use client";

import React, { useEffect, useRef, useState } from "react";
import { resolveFragment } from "../../lib/framework/navigation";
import type { DocTarget } from "../../lib/framework/types";

function findTarget(frame: HTMLElement, id: string): HTMLElement | null {
  // Avoid arbitrary document IDs and dynamically constructed CSS selectors.
  return Array.from(frame.querySelectorAll<HTMLElement>("[id]")).find((element) => element.id === id) ?? null;
}

function headerOffset(): number {
  return (window.matchMedia("(max-width: 1023px)").matches ? 112 : 96) + 24;
}

function revealTarget(element: HTMLElement, frame: HTMLElement): void {
  if (!element.hasAttribute("data-reveal-target")) return;
  if (element instanceof HTMLDetailsElement) element.open = true;
  for (let ancestor = element.parentElement; ancestor && ancestor !== frame; ancestor = ancestor.parentElement) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
  }
  element.dispatchEvent(new CustomEvent("docs-target",{bubbles:true,detail:{id:element.id}}));
}

function focusTarget(element: HTMLElement): void {
  const hadTabIndex = element.hasAttribute("tabindex");
  if (!hadTabIndex) {
    element.setAttribute("tabindex", "-1");
    element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
  }
  element.focus({ preventScroll: true });
}

export function TableOfContents({ targets }: { targets: DocTarget[] }) {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(targets[0]?.id ?? "");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const frame = navRef.current?.closest<HTMLElement>(".docs-frame");
    if (!frame) return;
    const navigationTargets: DocTarget[] = [...targets, { id: "docs-content", title: "正文", level: 2 }];
    let scrollFrame = 0;
    let navigationFrame = 0;
    let settleFrame = 0;

    const updateActive = () => {
      scrollFrame = 0;
      const visible = targets.map((target) => ({ target, element: findTarget(frame, target.id) }))
        .filter((item): item is { target: DocTarget; element: HTMLElement } => item.element !== null && item.element.getClientRects().length > 0);
      if (visible.length === 0) return;
      const edge = headerOffset() + 12;
      const preceding = visible.filter(({ element }) => element.getBoundingClientRect().top <= edge);
      setActiveId((preceding.at(-1) ?? visible[0]).target.id);
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActive);
    };

    const navigateToFragment = () => {
      window.cancelAnimationFrame(navigationFrame);
      window.cancelAnimationFrame(settleFrame);
      if (!window.location.hash) {
        setStatus("");
        onScroll();
        return;
      }
      const target = resolveFragment(window.location.hash, navigationTargets);
      const element = target && findTarget(frame, target.id);
      if (!target || !element) {
        setStatus("未找到此位置，已回到页面起点");
        setActiveId(targets[0]?.id ?? "");
        // The original fragment remains in the URL so a broken link is inspectable.
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      setStatus("");
      revealTarget(element, frame);
      // Wait for expanded details and the browser's native anchor jump to settle.
      navigationFrame = window.requestAnimationFrame(() => {
        settleFrame = window.requestAnimationFrame(() => {
          window.scrollTo({ top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - headerOffset()), behavior: "instant" });
          focusTarget(element);
          if (target.id !== "docs-content") setActiveId(target.id);
        });
      });
    };

    const onFrameClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || !frame.contains(anchor) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash && destination.hash === window.location.hash) {
        // Native links to the same hash do not dispatch hashchange.
        navigateToFragment();
      }
    };

    window.addEventListener("hashchange", navigateToFragment);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    frame.addEventListener("click", onFrameClick);
    if (window.location.hash) navigateToFragment();
    else updateActive();

    return () => {
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(navigationFrame);
      window.cancelAnimationFrame(settleFrame);
      window.removeEventListener("hashchange", navigateToFragment);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      frame.removeEventListener("click", onFrameClick);
    };
  }, [targets]);

  return (
    <nav className="docs-toc" aria-label="当前页目录" ref={navRef}>
      <p className="docs-toc-label">本页目录</p>
      <details className="docs-compact-toc"><summary>本页目录</summary><ol>{targets.filter(t=>t.level===2).map(target=><li key={target.id}><a href={`#${target.id}`}>{target.title}</a></li>)}</ol></details>
      <ol className="docs-toc-list">
        {targets.map((target) => (
          <li key={target.id} className={`docs-toc-item${target.level === 3 ? " docs-toc-item-nested" : ""}`}>
            <a className="docs-toc-link" href={`#${encodeURIComponent(target.id)}`} aria-current={activeId === target.id ? "location" : undefined}>{target.title}</a>
          </li>
        ))}
      </ol>
      <p className="docs-navigation-status" role="status" aria-live="polite" hidden={!status}>{status}</p>
    </nav>
  );
}
