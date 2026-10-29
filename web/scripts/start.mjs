import { access } from "node:fs/promises";

const output = process.env.ENABLE_FRAMEWORK_PREVIEW === "1" ? ".next-framework" : ".next";
const server = new URL(`../${output}/standalone/server.js`, import.meta.url);
try {
  await access(server);
} catch {
  throw new Error("Production output is missing. Run npm run build before npm start.");
}
const port = process.env.PORT || "3000";
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}
// Keep the local preview private. Remote hosting is a separate deployment task.
process.env.HOSTNAME = "127.0.0.1";
process.env.PORT = port;
await import(server.href);
