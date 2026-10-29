import { codeToTokensWithThemes, type BundledLanguage } from "shiki";
import type { CodeSample } from "./types";

function escape(value:string) {return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
export async function highlightSample(input: Omit<CodeSample,"lines">,language:BundledLanguage = "python"): Promise<CodeSample> {
  const tokens=await codeToTokensWithThemes(input.code.trimEnd(),{lang:language,themes:{light:"catppuccin-latte",dark:"catppuccin-mocha"}});
  return {...input,lines:tokens.map((line,index)=>({number:index+1,html:line.map(token=>{
    const light=token.variants.light.color??"#4c4f69",dark=token.variants.dark.color??"#cdd6f4";
    if(![light,dark].every(color=>/^#[0-9a-f]{3,8}$/i.test(color)))throw new Error("Invalid syntax color");
    return `<span style="--code-light:${light};--code-dark:${dark}">${escape(token.content)}</span>`;
  }).join("")}))};
}
