"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { isSearchHrefAllowed } from "../../lib/framework/registry";
import { searchEntries } from "../../lib/framework/search";
import type { SearchEntry } from "../../lib/framework/types";

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>;
}

export function SearchDialog({ entries }: { entries: SearchEntry[] }) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultListRef = useRef<HTMLUListElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const safeEntries = useMemo(() => entries.filter((entry) => isSearchHrefAllowed(entry.href)), [entries]);
  const results = useMemo(() => query.trim() ? searchEntries(safeEntries, query) : safeEntries, [query, safeEntries]);
  const selectedIndex = Math.min(activeIndex, Math.max(0, results.length - 1));

  const openDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    triggerRef.current?.closest(".docs-frame")?.dispatchEvent(new CustomEvent("docs-search-opening"));
    setQuery("");
    setActiveIndex(0);
    dialog.showModal();
    setIsOpen(true);
    inputRef.current?.focus();
  }, []);

  const closeDialog = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, []);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      if (!triggerRef.current?.closest(".docs-frame")) return;
      event.preventDefault();
      if (dialogRef.current?.open) closeDialog();
      else openDialog();
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [openDialog, closeDialog]);

  useEffect(() => {
    if (!isOpen || !triggerRef.current?.closest(".docs-frame")) return;
    // Native dialog owns focus; the single temporary global style only locks
    // background scrolling and is restored on close, route change, or unmount.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  useEffect(() => {
    const list = resultListRef.current;
    const result = resultRefs.current[selectedIndex];
    if (!isOpen || !list || !result) return;
    const listRect = list.getBoundingClientRect();
    const resultRect = result.getBoundingClientRect();
    if (resultRect.top < listRect.top) list.scrollTop -= listRect.top - resultRect.top;
    else if (resultRect.bottom > listRect.bottom) list.scrollTop += resultRect.bottom - listRect.bottom;
  }, [isOpen, selectedIndex]);

  return (
    <>
      <button ref={triggerRef} type="button" className="docs-search-trigger" onClick={openDialog} aria-haspopup="dialog" aria-controls={`${id}-dialog`}>
        <SearchIcon /><span>搜索文档</span><kbd className="docs-search-shortcut" aria-hidden="true">Ctrl K</kbd>
      </button>
      <dialog ref={dialogRef} id={`${id}-dialog`} className="docs-search-dialog" aria-labelledby={`${id}-label`}
        onCancel={(event) => { event.preventDefault(); closeDialog(); }}
        onClose={() => { setIsOpen(false); triggerRef.current?.focus({ preventScroll: true }); }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
        }}>
        <div className="docs-search-panel">
          <div className="docs-search-header">
            <label className="docs-search-label" id={`${id}-label`} htmlFor={`${id}-input`}>搜索文档</label>
            <button type="button" className="docs-search-close" onClick={closeDialog} aria-label="关闭搜索">Esc <span aria-hidden="true">×</span></button>
          </div>
          <div className="docs-search-input-wrap">
            <SearchIcon />
            <input ref={inputRef} id={`${id}-input`} className="docs-search-input" type="search" placeholder="搜索标题、关键词或文件名…" value={query} autoComplete="off" spellCheck={false}
              role="combobox" aria-expanded={isOpen} aria-autocomplete="list" aria-controls={`${id}-results`} aria-activedescendant={results.length > 0 ? `${id}-result-${selectedIndex}` : undefined}
              onChange={(event) => { setQuery(event.currentTarget.value); setActiveIndex(0); }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                if ((event.key === "ArrowDown" || event.key === "ArrowUp") && results.length > 0) {
                  event.preventDefault();
                  setActiveIndex((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
                } else if (event.key === "Enter" && results.length > 0) {
                  event.preventDefault();
                  resultRefs.current[selectedIndex]?.click();
                }
              }} />
          </div>
          <p className="docs-search-caption" role="status" aria-live="polite">{query.trim() ? `找到 ${results.length} 个结果` : "快速跳转 · 输入关键词筛选"}</p>
          <ul ref={resultListRef} className="docs-search-results" id={`${id}-results`} role="listbox" aria-label="搜索结果">
            {results.map((entry, index) => (
              <li key={entry.id} className="docs-search-result-item" role="presentation">
                <a ref={(element) => { resultRefs.current[index] = element; }} id={`${id}-result-${index}`} className="docs-search-result" href={entry.href} role="option" aria-selected={selectedIndex === index} tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(index)} onClick={closeDialog}>
                  <span className="docs-search-result-section">{entry.section}</span>
                  <strong className="docs-search-result-title">{entry.title}<span aria-hidden="true">↗</span></strong>
                  <span className="docs-search-result-summary">{entry.summary}</span>
                </a>
              </li>
            ))}
          </ul>
          {results.length === 0 && <p className="docs-search-empty">{query.trim() ? `没有找到“${query.trim()}”。试试标题中的词或文件名。` : "暂无可搜索的文档。"}</p>}
          <div className="docs-search-footer" aria-hidden="true"><span>↑ ↓ 选择</span><span>Enter 打开</span><span>Esc 关闭</span></div>
        </div>
      </dialog>
      <noscript><p className="docs-search-fallback">搜索需要 JavaScript，可使用浏览器的页内查找。</p></noscript>
    </>
  );
}
