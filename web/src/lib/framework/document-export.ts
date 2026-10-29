import { Children, isValidElement, type ReactNode } from "react";
import type { CodeSample } from "./types";

/** Traverse controlled content slots, not browser DOM or the selected UI state. */
export function exportDocumentText(node:ReactNode,options:{excludeTypes?:unknown[]}={}):string {
  const seen=new Set<string>();
  function visit(value:ReactNode):string {
    if(typeof value==='string'||typeof value==='number')return String(value);
    if(!value)return '';
    if(Array.isArray(value))return value.map(visit).filter(Boolean).join('\n');
    if(!isValidElement(value))return '';
    const props=value.props as {children?:ReactNode;title?:string;samples?:CodeSample[];defaultSampleId?:string;items?:{title:string;body:ReactNode}[];flowOnly?:boolean};
    // Native/controlled disclosures are optional alternatives, not the default lesson stream.
    if(value.type==='details'||value.type==='svg'||options.excludeTypes?.includes(value.type))return '';
    if(props.samples) {
      if(props.flowOnly)return '输入 → 接收 → 匹配 → 处理函数 → 输出';
      const sample=props.samples.find(s=>s.id===props.defaultSampleId)??props.samples[0];
      if(!sample||seen.has(sample.code))return '';
      seen.add(sample.code);
      return `${props.title??sample.label}\n${sample.code}`;
    }
    if(props.items)return props.items.map((item,index)=>`${index+1}. ${item.title}\n${visit(item.body)}`).join('\n\n');
    const contents=Children.toArray(props.children).map(visit).join(typeof value.type==='string'&&['p','code','strong','span','a'].includes(value.type)?'':'\n');
    return props.title&&typeof value.type!=='string'?`${props.title}\n${contents}`:contents;
  }
  return visit(node).replace(/\n{3,}/g,'\n\n').trim()+'\n';
}
