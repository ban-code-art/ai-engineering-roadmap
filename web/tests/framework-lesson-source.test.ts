import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readPinnedSource, extractSnippet, sourceHref, validateSourceRef, type SourceRef } from "../src/lib/course/source-contract";

test("pinned source reads the published object, ignores later working edits, and checks its hash", () => {
  const root = mkdtempSync(join(tmpdir(), "fastapi-source-test-"));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  try {
    git("init", "--quiet");
    git("config", "user.name", "Source contract test");
    git("config", "user.email", "source-test@example.invalid");
    git("config", "core.autocrlf", "false");
    mkdirSync(join(root, "courses/fastapi/labs/test"), { recursive: true });
    const path = "courses/fastapi/labs/test/example.py";
    const code = "def greeting():\n    return 'hello'\n\nprint(greeting())\n";
    writeFileSync(join(root, path), code);
    git("add", "courses");
    git("commit", "--quiet", "-m", "publish source");
    const ref: SourceRef = {
      id: "test", commit: git("rev-parse", "HEAD"), checkpointRef: "refs/tags/fastapi-w01",
      sourceRoot: "courses/fastapi/labs/test", path: "example.py",
      sha256: createHash("sha256").update(code).digest("hex"), language: "python",
    };
    writeFileSync(join(root, path), "unpublished = True\n");
    assert.equal(readPinnedSource(root, ref, { fetchMissing: false }), code);
    assert.throws(() => readPinnedSource(root, { ...ref, sha256: "0".repeat(64) }, { fetchMissing: false }), /hash/i);
    assert.throws(() => readPinnedSource(root, { ...ref, commit: "a".repeat(40) }, { fetchMissing: false }), /missing|absent/i);
    assert.throws(() => readPinnedSource(root, { ...ref, path: "missing.py" }, { fetchMissing: false }), /source|path|object/i);
    const snippet = extractSnippet(code, 1, 2);
    assert.equal(snippet.code, "def greeting():\n    return 'hello'\n");
    assert.equal(snippet.start, 1);
    assert.equal(snippet.end, 2);
    assert.equal(sourceHref(ref, 1, 2), `https://github.com/ban-code-art/ai-engineering-roadmap/blob/${ref.commit}/${path}#L1-L2`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("source references reject unknown roots, traversals, moving branches, and invalid line ranges", () => {
  const ref: SourceRef = { id: "test", commit: "a".repeat(40), checkpointRef: "refs/tags/fastapi-w01", sourceRoot: "courses/fastapi/labs/f03-python", path: "functions.py", sha256: "b".repeat(64), language: "python" };
  for (const change of [
    { commit: "main" }, { checkpointRef: "main" }, { sourceRoot: "web" },
    { path: "../secret.py" }, { path: "/absolute.py" }, { path: "nested/../../secret.py" },
    { path: "nested\\file.py" }, { sha256: "missing" },
  ]) assert.throws(() => validateSourceRef({ ...ref, ...change }));
  assert.doesNotThrow(() => validateSourceRef({ ...ref, sourceRoot: "courses/fastapi/demo" }));
  for (const [start, end] of [[0, 1], [1, 4], [2, 1], [1.5, 2]]) {
    assert.throws(() => extractSnippet("first\nsecond\n", start, end), /line|range/i);
  }
});
