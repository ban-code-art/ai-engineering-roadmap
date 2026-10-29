import { access, cp } from "node:fs/promises";

const output = process.env.ENABLE_FRAMEWORK_PREVIEW === "1" ? ".next-framework" : ".next";
const standalone = new URL(`../${output}/standalone/`, import.meta.url);
await access(new URL("server.js", standalone));
// Next traces the server, but its standalone output needs public/static assets
// copied alongside it so a standalone server can serve the complete website.
await cp(new URL("../public/", import.meta.url), new URL("public/", standalone), { recursive: true });
await cp(new URL(`../${output}/static/`, import.meta.url), new URL(`${output}/static/`, standalone), { recursive: true });
console.log("Standalone server and local public/static assets are ready.");
