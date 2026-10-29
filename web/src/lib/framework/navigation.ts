import type { DocTarget } from "./types";

/** A URL fragment may name only a target supplied by the current document. */
export function resolveFragment(hash: string, targets: readonly DocTarget[]): DocTarget | null {
  if (!hash.startsWith("#") || hash.length < 2) return null;
  try {
    const id = decodeURIComponent(hash.slice(1));
    return targets.find((target) => target.id === id) ?? null;
  } catch {
    return null;
  }
}
