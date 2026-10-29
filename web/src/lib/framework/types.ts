import type { ReactNode } from "react";

export interface DocTarget {
  id: string;
  title: string;
  level: 2 | 3;
}
export interface SearchEntry {
  id: string;
  title: string;
  section: string;
  summary: string;
  href: string;
  preview?: boolean;
}
export interface DocsSection {
  id: string;
  title: string;
  children: ReactNode;
}
export interface HighlightedLine { number: number; html: string }
export interface CodeSample {
  id: string;
  label: string;
  code: string;
  lines: HighlightedLine[];
  sourcePath?: string;
  sourceHash?: string;
  checkpoint?: string;
  sourceUrl?: string;
  /** One-based positions within this displayed excerpt; source text stays unchanged. */
  highlightLines?: number[];
}
export const PREVIEW_PATH = "/framework-preview";
