import { codeToTokensWithThemes, type BundledLanguage } from "shiki";
import type { CodeSample } from "./types";

function escape(value:string) {return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}

function luminance(rgb:number[]):number {
  const linear=rgb.map(value=>{const channel=value/255;return channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4;});
  return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
}

/** Keep Catppuccin hue families while making 14px tokens readable on focused rows. */
function readableColor(hex:string,theme:"light"|"dark"):string {
  const raw=hex.slice(1);
  const expanded=raw.length<=4?raw.slice(0,3).split("").map(char=>char+char).join(""):raw.slice(0,6);
  const channels=[0,2,4].map(start=>parseInt(expanded.slice(start,start+2),16));
  const background=theme==="light"?[212,230,244]:[32,62,85];
  const backgroundLuminance=luminance(background);
  const target=theme==="light"?0:255;
  for(let amount=0;amount<=100;amount++) {
    const adjusted=channels.map(channel=>Math.round(channel+(target-channel)*amount/100));
    const tokenLuminance=luminance(adjusted);
    const ratio=(Math.max(tokenLuminance,backgroundLuminance)+.05)/(Math.min(tokenLuminance,backgroundLuminance)+.05);
    if(ratio>=4.6)return `#${adjusted.map(channel=>channel.toString(16).padStart(2,"0")).join("")}`;
  }
  return theme==="light"?"#000000":"#ffffff";
}

export async function highlightSample(input: Omit<CodeSample,"lines">,language:BundledLanguage = "python"): Promise<CodeSample> {
  const tokens=await codeToTokensWithThemes(input.code,{lang:language,themes:{light:"catppuccin-latte",dark:"catppuccin-mocha"}});
  return {...input,lines:tokens.map((line,index)=>({number:index+1,html:line.map(token=>{
    const light=token.variants.light.color??"#4c4f69",dark=token.variants.dark.color??"#cdd6f4";
    if(![light,dark].every(color=>/^#[0-9a-f]{3,8}$/i.test(color)))throw new Error("Invalid syntax color");
    return `<span style="--code-light:${readableColor(light,"light")};--code-dark:${readableColor(dark,"dark")}">${escape(token.content)}</span>`;
  }).join("")}))};
}
