import type { ReactNode } from "react";

type CardIcon = "request" | "response" | "terminal" | "code" | "layers" | "route";
export interface LessonCard {
  title: string;
  description: ReactNode;
  href?: string;
  icon: CardIcon;
  tone?: "blue" | "green" | "amber";
}

function CardIcon({ icon }: { icon: CardIcon }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {icon === "request" ? <><path d="M3 7h15m-4-4 4 4-4 4M3 17h10"/><path d="M3 12h7"/></>
      : icon === "response" ? <><path d="M21 7H6m4-4-4 4 4 4m11 6H11"/><path d="M21 12h-7"/></>
      : icon === "terminal" ? <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/></>
      : icon === "code" ? <><path d="m8 6-5 6 5 6m8-12 5 6-5 6m-3-14-2 16"/></>
      : icon === "layers" ? <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></>
      : <><circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M5 7v7a5 5 0 0 0 5 5h7M11 5h8v8m-8 0 8-8"/></>}
  </svg>;
}

/** Cards express a real comparison or destination; plain teaching prose stays continuous. */
export function LessonCards({ cards, label }: { cards: LessonCard[]; label: string }) {
  return <div className="docs-lesson-cards" aria-label={label}>
    {cards.map(card => {
      const body = <>
        <div className="docs-lesson-card-heading"><CardIcon icon={card.icon}/>{card.href && <span className="docs-lesson-card-arrow" aria-hidden="true">↗</span>}</div>
        <strong className="docs-lesson-card-title">{card.title}</strong>
        <div className="docs-lesson-card-description">{card.description}</div>
      </>;
      return card.href ? <a key={card.title} className="docs-lesson-card" data-tone={card.tone ?? "blue"} href={card.href}>{body}</a>
        : <article key={card.title} className="docs-lesson-card" data-tone={card.tone ?? "blue"}>{body}</article>;
    })}
  </div>;
}
