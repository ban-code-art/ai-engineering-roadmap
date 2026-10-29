import { readFileSync, mkdirSync, writeFileSync, renameSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readPinnedSource, type SourceRef } from "../src/lib/course/source-contract";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = resolve(web, "..");
const manifest = JSON.parse(readFileSync(resolve(root, "courses/fastapi/source-manifest.json"), "utf8")) as {
  format: string; sources: SourceRef[];
};
if (manifest.format !== "fastapi-source-manifest/v1" || !Array.isArray(manifest.sources) || !manifest.sources.length) {
  throw new Error("Missing or unsupported FastAPI source manifest");
}
const sources: Record<string, SourceRef & { code: string }> = {};
for (const ref of manifest.sources) {
  if (sources[ref.id]) throw new Error(`Duplicate course source: ${ref.id}`);
  // Check the fixed Git object even if a local cache already exists.
  const code = readPinnedSource(root, ref);
  const cache = resolve(web, ".course-sources", ref.commit, ref.sourceRoot, ref.path);
  mkdirSync(dirname(cache), { recursive: true });
  const cacheTemporary = `${cache}.${randomUUID()}.tmp`;
  writeFileSync(cacheTemporary, code, "utf8");
  renameSync(cacheTemporary, cache);
  sources[ref.id] = { ...ref, code };
}
const output = resolve(web, "src/content/fastapi/generated-sources.json");
mkdirSync(dirname(output), { recursive: true });
const temporary = `${output}.${randomUUID()}.tmp`;
writeFileSync(temporary, JSON.stringify({ format: "fastapi-source-snapshot/v1", sources }, null, 2) + "\n", "utf8");
renameSync(temporary, output);
console.log(`Verified ${manifest.sources.length} pinned FastAPI source files; generated reading assets.`);
