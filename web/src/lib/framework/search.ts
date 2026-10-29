import type { SearchEntry } from "./types";

function normalize(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("zh-CN");
}

/** Substring matching preserves Chinese words and punctuation in file names. */
export function searchEntries(entries: readonly SearchEntry[], query: string): SearchEntry[] {
  const terms = [...new Set(normalize(query).trim().split(/\s+/u).filter(Boolean))];
  if (terms.length === 0) return [];

  return entries
    .map((entry, order) => {
      const title = normalize(entry.title);
      const section = normalize(entry.section);
      const text = normalize(`${entry.title} ${entry.section} ${entry.summary} ${entry.id} ${entry.href}`);
      if (!terms.every((term) => text.includes(term))) return null;
      const score = terms.reduce((total, term) => total + (title === term ? 8 : title.startsWith(term) ? 5 : title.includes(term) ? 3 : section.includes(term) ? 2 : 1), 0);
      return { entry, order, score };
    })
    .filter((match): match is { entry: SearchEntry; order: number; score: number } => match !== null)
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .map((match) => match.entry);
}
