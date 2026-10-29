import snapshot from "../../content/fastapi/generated-sources.json";
import { extractSnippet, sourceHref, sourceTreeHref, type SourceRef } from "./source-contract";
import { highlightSample } from "../framework/highlight";
import type { BundledLanguage } from "shiki";

const sources = snapshot.sources as Record<string, SourceRef & { code: string }>;

export function getSource(id: string) {
  const source = sources[id];
  if (!source) throw new Error(`Unknown published FastAPI source: ${id}`);
  return source;
}

export async function getSourceSample(id: string, options: {
  start?: number; end?: number; label?: string; language?: string; highlightLines?: number[];
} = {}) {
  const ref = getSource(id);
  const snippet = extractSnippet(ref.code, options.start, options.end);
  const language = options.language ?? ref.language;
  const emphasis = options.highlightLines ?? [];
  if (emphasis.some(line=>!Number.isInteger(line)||line<snippet.start||line>snippet.end)) {
    throw new Error(`Highlighted source line outside displayed range: ${id}`);
  }
  const input = {
    id: `${id}-${snippet.start}-${snippet.end}`,
    label: options.label ?? ref.path,
    code: snippet.code,
    sourcePath: `${ref.sourceRoot}/${ref.path}`,
    sourceHash: ref.sha256,
    checkpoint: `W01 · ${ref.commit.slice(0, 7)} · L${snippet.start}–L${snippet.end}`,
    sourceUrl: sourceHref(ref, snippet.start, snippet.end),
    highlightLines: [...new Set(emphasis)].sort((a,b)=>a-b).map(line=>line-snippet.start+1),
  };
  if (language === "text") return { ...input, lines: [] };
  return highlightSample(input, language as BundledLanguage);
}

export function getSourceLinks(id: string) {
  const ref = getSource(id);
  return { file: sourceHref(ref), tree: sourceTreeHref(ref), commit: ref.commit, path: ref.path };
}
