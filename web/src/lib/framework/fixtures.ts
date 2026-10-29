import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { highlightSample } from "./highlight";

const fixtureNames = ["base", "uppercase", "extended"] as const;
export type FixtureName = typeof fixtureNames[number];

export async function loadFixture(name: FixtureName) {
  if (!fixtureNames.includes(name)) throw new Error("Unknown framework fixture");
  const path = `fixtures/code/${name}/sample.py`;
  const bytes = await readFile(resolve(process.cwd(), path));
  return highlightSample({id:name,label:name==="base"?"基础样例":name==="uppercase"?"独立变体":"扩展样例",
    code:bytes.toString("utf8").replaceAll("\r\n","\n"),sourcePath:`web/${path}`,
    sourceHash:createHash("sha256").update(bytes).digest("hex"),checkpoint:name});
}
