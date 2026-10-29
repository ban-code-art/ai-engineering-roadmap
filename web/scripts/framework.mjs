import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../",import.meta.url));
const env={...process.env,ENABLE_FRAMEWORK_PREVIEW:"1",PORT:process.env.PORT||"3001"};
const action=process.argv[2];
if(!["dev","build","start"].includes(action))throw new Error("Use framework.mjs dev, build or start");
async function run(script,args=[]) {
  const child=spawn(process.execPath,[fileURLToPath(new URL(script,import.meta.url)),...args],{cwd:root,env,stdio:"inherit"});
  const forward=()=>child.kill("SIGINT");process.once("SIGINT",forward);process.once("SIGTERM",forward);
  await new Promise((resolve,reject)=>{child.once("error",reject);child.once("exit",code=>code===0?resolve():reject(new Error(`Framework ${action} exited ${code}`)));});
  process.removeListener("SIGINT",forward);process.removeListener("SIGTERM",forward);
}
if(action==="build") {await run("../node_modules/next/dist/bin/next",["build"]);await run("./prepare-standalone.mjs");}
if(action==="dev") await run("../node_modules/next/dist/bin/next",["dev","--hostname","127.0.0.1","--port",env.PORT]);
if(action==="start") await run("./start.mjs");
