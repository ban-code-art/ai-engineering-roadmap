import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";

export const COURSE_REPOSITORY = "https://github.com/ban-code-art/ai-engineering-roadmap";

export interface SourceRef {
  id: string;
  commit: string;
  checkpointRef: string;
  sourceRoot: string;
  path: string;
  sha256: string;
  language: string;
}

function safePath(value: string): boolean {
  return /^[a-zA-Z0-9_.\/-]+$/.test(value)
    && value.split("/").every(part => part !== ".." && part !== "." && part !== "");
}

export function validateSourceRef(ref: SourceRef): void {
  if (!ref || [ref.id, ref.commit, ref.sha256, ref.path, ref.sourceRoot, ref.checkpointRef, ref.language].some(value=>typeof value!=="string")) throw new Error("Invalid source manifest fields");
  if (!/^[a-z0-9-]+$/.test(ref.id) || !/^[a-f0-9]{40}$/.test(ref.commit)
    || !/^[a-f0-9]{64}$/.test(ref.sha256)) throw new Error("Invalid pinned source identity/hash");
  if (!/^refs\/tags\/fastapi-[a-z0-9-]+$/.test(ref.checkpointRef)) throw new Error("Source checkpoint must be a course tag");
  if (!["python","powershell","bash","http","text","json"].includes(ref.language)) throw new Error("Unsupported source language");
  if (!safePath(ref.sourceRoot) || !safePath(ref.path)
    || !(ref.sourceRoot === "courses/fastapi/demo" || ref.sourceRoot.startsWith("courses/fastapi/demo/")
      || ref.sourceRoot.startsWith("courses/fastapi/labs/"))) throw new Error("Source path outside course whitelist");
}

function git(root: string, args: string[]): Buffer {
  return execFileSync("git", args, { cwd: root, maxBuffer: 2 * 1024 * 1024, timeout: 60_000, stdio: ["ignore", "pipe", "pipe"] });
}

function hasCommit(root: string, commit: string): boolean {
  try { git(root, ["cat-file", "-e", `${commit}^{commit}`]); return true; }
  catch { return false; }
}

/** Resolve only the published Git object; later working files are never a fallback. */
export function readPinnedSource(root: string, ref: SourceRef, options: { fetchMissing?: boolean } = {}): string {
  validateSourceRef(ref);
  if (!hasCommit(root, ref.commit)) {
    if (options.fetchMissing === false) throw new Error(`Pinned source commit missing: ${ref.commit}`);
    const origin = git(root, ["remote", "get-url", "origin"]).toString("utf8").trim().replace(/\.git$/, "");
    if (![COURSE_REPOSITORY, "git@github.com:ban-code-art/ai-engineering-roadmap"].includes(origin)) {
      throw new Error("Cannot fetch course source from an unverified origin");
    }
    // A private ref avoids coupling this validation to another process's FETCH_HEAD.
    const fetchRef = `refs/course-sources/${ref.commit}-${randomUUID()}`;
    try {
      git(root, ["fetch", "--no-tags", "--depth=1", "origin", `${ref.checkpointRef}:${fetchRef}`]);
      const fetched = git(root, ["rev-parse", `${fetchRef}^{commit}`]).toString("utf8").trim();
      if (fetched !== ref.commit) throw new Error(`Pinned checkpoint changed: ${ref.checkpointRef}`);
      if (!hasCommit(root, ref.commit)) throw new Error(`Pinned source commit still missing: ${ref.commit}`);
    } finally {
      try { git(root, ["update-ref", "-d", fetchRef]); } catch { /* Preserve the fetch/validation error. */ }
    }
  }
  let bytes: Buffer;
  try { bytes = git(root, ["show", `${ref.commit}:${ref.sourceRoot}/${ref.path}`]); }
  catch { throw new Error(`Pinned source path missing: ${ref.id}`); }
  if (createHash("sha256").update(bytes).digest("hex") !== ref.sha256) throw new Error(`Pinned source hash mismatch: ${ref.id}`);
  if (bytes.includes(0)) throw new Error(`Pinned source must be text: ${ref.id}`);
  return bytes.toString("utf8").replaceAll("\r\n", "\n");
}

export function extractSnippet(code: string, start = 1, end?: number): { code: string; start: number; end: number } {
  const lines = code.replaceAll("\r\n", "\n").split("\n");
  if (lines.at(-1) === "") lines.pop();
  const last = end ?? lines.length;
  if (!Number.isInteger(start) || !Number.isInteger(last) || start < 1 || last < start || last > lines.length) {
    throw new Error(`Invalid source line range: ${start}–${last} (${lines.length} lines)`);
  }
  return { code: lines.slice(start - 1, last).join("\n") + "\n", start, end: last };
}

export function sourceHref(ref: SourceRef, start?: number, end?: number): string {
  validateSourceRef(ref);
  const anchor = start === undefined ? "" : `#L${start}${end === undefined || end === start ? "" : `-L${end}`}`;
  return `${COURSE_REPOSITORY}/blob/${ref.commit}/${ref.sourceRoot}/${ref.path}${anchor}`;
}

export function sourceTreeHref(ref: SourceRef): string {
  validateSourceRef(ref);
  return `${COURSE_REPOSITORY}/tree/${ref.commit}/${ref.sourceRoot}`;
}
