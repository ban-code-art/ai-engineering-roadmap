"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type CopyStatus = "idle" | "copying" | "copied" | "error";

interface DocsCopyButtonProps {
  text: string;
  label: string;
  iconOnly?: boolean;
  className?: string;
}

/** Shared clipboard control for page text and the active, complete source sample. */
export function DocsCopyButton({ text, label, iconOnly = false, className = "" }: DocsCopyButtonProps) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<CopyStatus>("idle");
  const request = useRef(0);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);
    return () => {
      request.current += 1;
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  useEffect(() => {
    request.current += 1;
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    setStatus("idle");
  }, [text]);

  async function copyText() {
    const currentRequest = ++request.current;
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    setStatus("copying");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API is unavailable");
      await navigator.clipboard.writeText(text);
      if (request.current !== currentRequest) return;
      setStatus("copied");
      resetTimer.current = window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      if (request.current === currentRequest) setStatus("error");
    }
  }

  const feedback = status === "copied" ? "已复制"
    : status === "error" ? "复制不可用，请选中代码手动复制"
      : status === "copying" ? "正在复制…" : "";

  return (
    <div className={`docs-copy-control${className ? ` ${className}` : ""}`} data-copy-status={status}>
      <button
        type="button"
        className="docs-copy-button"
        aria-label={label}
        title={label}
        disabled={!ready || status === "copying"}
        onClick={copyText}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          {status === "copied" ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>}
        </svg>
        {!iconOnly && <span className="docs-copy-label">{label}</span>}
      </button>
      <span className="docs-copy-status" role="status" aria-live="polite" aria-atomic="true">{feedback}</span>
    </div>
  );
}

export function CopyPageButton({ text }: { text: string }) {
  return <DocsCopyButton text={text} label="复制页面" className="docs-page-copy" />;
}

type CalloutKind = "note" | "tip" | "warning" | "danger" | "info";

const calloutTitles: Record<CalloutKind, string> = {
  note: "备注",
  tip: "提示",
  warning: "注意",
  danger: "重要",
  info: "说明",
};

function CalloutIcon({ kind }: { kind: CalloutKind }) {
  return (
    <svg className="docs-callout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "tip" ? <><path d="M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0L15 17H9l-.5-2.5Z" /><path d="M12 3V1M3 10H1M23 10h-2" /></>
        : kind === "warning" ? <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5M12 17h.01" /></>
          : kind === "danger" ? <><path d="m12 2 10 10-10 10L2 12 12 2Z" /><path d="M12 7v6M12 16h.01" /></>
            : kind === "note" ? <><path d="M14 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9" /><path d="m10 14 1-4 8-8 3 3-8 8-4 1Z" /></>
              : <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>}
    </svg>
  );
}

export function DocsCallout({ kind, title, children }: { kind: CalloutKind; title?: string; children: ReactNode }) {
  const heading = title ?? calloutTitles[kind];
  return (
    <aside className="docs-callout" data-kind={kind} aria-label={heading}>
      <CalloutIcon kind={kind} />
      <div className="docs-callout-content">
        <p className="docs-callout-title">{heading}</p>
        <div className="docs-callout-body">{children}</div>
      </div>
    </aside>
  );
}

export function DocsAccordion({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <details id={id} className="docs-accordion">
      <summary>{title}</summary>
      <div className="docs-accordion-body">{children}</div>
    </details>
  );
}

export function DocsSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="docs-section" aria-labelledby={id}>
      <h2 id={id} tabIndex={-1} className="docs-section-heading" aria-label={title}>
        {title}
        <a className="docs-section-anchor" href={`#${id}`} aria-label={`${title}的链接`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
        </a>
      </h2>
      {children}
    </section>
  );
}

export function DocsSteps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className="docs-steps">
      {items.map((item, index) => (
        <li className="docs-step" key={`${index}-${item.title}`}>
          <span className="docs-step-number" aria-hidden="true">{index + 1}</span>
          <div className="docs-step-content">
            <h3 className="docs-step-title">{item.title}</h3>
            <div className="docs-step-body">{item.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
