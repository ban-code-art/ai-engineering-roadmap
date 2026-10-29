import test from "node:test";
import assert from "node:assert/strict";
import { highlightSample } from "../src/lib/framework/highlight";

function luminance(hex: string) {
  const channels = [1,3,5].map(start=>parseInt(hex.slice(start,start+2),16)/255)
    .map(value=>value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4);
  return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
}
function contrast(a: string,b: string) {
  const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (values[0]+0.05)/(values[1]+0.05);
}

test("small syntax text remains legible on both plain and emphasized code surfaces",async()=>{
  const code = '# Explain the cause\ndef greet(name: str) -> str:\n    return "Hello, " + name\nprint(greet("Lin"))\n';
  const sample=await highlightSample({id:"contrast",label:"Python",code});
  assert.equal(sample.code,code);
  const html=sample.lines.map(line=>line.html).join("");
  for(const token of html.matchAll(/--code-light:(#[a-f0-9]{6});--code-dark:(#[a-f0-9]{6})/gi)) {
    for(const background of ["#e9eef5","#d4e6f4"]) assert.ok(contrast(token[1],background)>=4.5,`${token[1]} on ${background}`);
    for(const background of ["#151f2e","#203e55"]) assert.ok(contrast(token[2],background)>=4.5,`${token[2]} on ${background}`);
  }
});
