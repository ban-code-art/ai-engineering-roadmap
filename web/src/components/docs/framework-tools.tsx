"use client";

import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ReactFlow, MarkerType, Position, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CodeGroup } from "./code-group";
import type { CodeSample } from "@/lib/framework/types";

const subscribe=(listener:()=>void)=>{const q=window.matchMedia("(max-width: 700px)");q.addEventListener("change",listener);return()=>q.removeEventListener("change",listener);};
const snapshot=()=>window.matchMedia("(max-width: 700px)").matches;
const serverSnapshot=()=>false;
const explanations:Record<string,string>={
  client:"客户端指定主机、端口与路径，发送请求。它不在自己的窗口执行服务器Python文件。",
  server:"服务节点接收请求，并将输入传给后续处理节点。这是框架图组件的演示。",
  match:"应用使用请求方法与路径查找已登记路由。方法/路径不匹配时不会调用处理函数。",
  handler:"处理节点接收输入并输出结果；本图只是组件交互样例，不执行Python。",
  json:"响应节点输出结构化结果。节点说明来自组件样例数据，不代表真实接口已执行。",
  missing:"服务器已收到请求，未匹配路径，返回HTTP 404，本次不执行处理函数。",
  connection:"监听停止后连接失败，没有HTTP响应，流程未到路由匹配。",
};
class FlowBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return{failed:true};}
  render(){return this.state.failed?<p role="status">图暂时不可用，下方文字流程提供相同解释。</p>:this.props.children;}
}

export function FrameworkTools({samples,flowOnly=false}:{samples:CodeSample[];flowOnly?:boolean}) {
  const [version,setVersion]=useState(samples[0].id);
  const [scenario,setScenario]=useState<"success"|"missing"|"stopped">("success");
  const [selected,setSelected]=useState<string|null>(null);
  const [showGraph,setShowGraph]=useState(true);
  const target=useRef<HTMLDivElement>(null);
  const [canvasWidth,setCanvasWidth]=useState(600);
  useEffect(()=>{
    const element=target.current;
    if(!element)return;
    const reveal=()=>{setScenario("success");setSelected("handler");setShowGraph(true);};
    const resize=new ResizeObserver(entries=>setCanvasWidth(Math.round(entries[0].contentRect.width)));
    resize.observe(element);
    element.addEventListener("docs-target",reveal);
    try {if(decodeURIComponent(location.hash.slice(1))==="flow--node--handler")reveal();} catch {}
    return()=>{resize.disconnect();element.removeEventListener("docs-target",reveal);};
  },[]);
  const compact=useSyncExternalStore(subscribe,snapshot,serverSnapshot)||canvasWidth<520;
  const current=samples.find(s=>s.id===version)!;
  const list = scenario === "stopped" ? [{id:"client",label:"客户端"},{id:"connection",label:"连接失败"}] :
    scenario === "missing" ? [{id:"client",label:"客户端"},{id:"server",label:"接收连接"},{id:"match",label:"路径匹配"},{id:"missing",label:"HTTP 404"}] :
    [{id:"client",label:"客户端"},{id:"server",label:"接收连接"},{id:"match",label:"路径匹配"},{id:"handler",label:"处理函数"},{id:"json",label:"JSON 响应"}];
  const nodes:Node[]=list.map((item,index)=>({id:item.id,data:{label:item.label},
    position:compact?{x:0,y:index*70}:{x:(index<3?index:5-index)*180,y:index<3?0:105},
    sourcePosition:compact?Position.Bottom:index===2?Position.Bottom:index>=3?Position.Left:Position.Right,
    targetPosition:compact?Position.Top:index===3?Position.Top:index>3?Position.Right:Position.Left,
    style:{width:compact?220:150},className:`docs-flow-node${selected===item.id?' docs-flow-selected':''}`,
  }));
  const edges:Edge[]=list.slice(1).map((item,index)=>({id:`${list[index].id}-${item.id}`,source:list[index].id,target:item.id,markerEnd:{type:MarkerType.ArrowClosed}}));
  if(!flowOnly) return <div className="docs-file-example">
    <div className="docs-file-tree" aria-label="项目目录"><strong>component-fixtures /</strong><ul><li>base /</li><li>uppercase /</li><li>extended /</li></ul></div>
    <details className="docs-file-details" id="files--file--sample-py" data-reveal-target open>
      <summary>sample.py <span>组件样例</span></summary>
      <div><dl><dt>父目录</dt><dd>web / fixtures / code</dd><dt>创建位置</dt><dd>fixtures / code / sample.py</dd><dt>导入者</dt><dd>预览页只读加载，展示代码与版本隔离</dd></dl>
        <label className="docs-file-version">组件版本 <select aria-label="文件源码版本" value={version} onChange={e=>setVersion(e.target.value)}>{samples.map(sample=><option key={sample.id} value={sample.id}>{sample.id}</option>)}</select></label>
        <CodeGroup key={version} id="file-source" title={`sample.py · ${version}`} samples={[current]}/>
      </div>
    </details><p className="docs-caption">目录与源码只读展示，需要在自己的项目中创建并保存。</p>
  </div>;
  return <div ref={target} id="flow--node--handler" data-reveal-target className="docs-flow-example">
    <div className="docs-flow-options" role="group" aria-label="请求分支">{([['success','匹配成功'],['missing','路径 404'],['stopped','服务停止']] as const).map(([value,label])=>
      <button key={value} type="button" aria-pressed={scenario===value} onClick={()=>{setScenario(value);setSelected(null);}}>{label}</button>)}
      <button type="button" aria-pressed={!showGraph} onClick={()=>setShowGraph(!showGraph)}>{showGraph?'查看文字流程':'恢复图形'}</button>
    </div>
    {showGraph&&<FlowBoundary><div className="docs-flow-canvas" style={{height:compact?list.length*70+48:228}}>
      <ReactFlow key={`${compact}-${scenario}-${canvasWidth}`} nodes={nodes} edges={edges} fitView minZoom={.2} maxZoom={1.1}
        nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} zoomOnScroll={false} zoomOnPinch={false}
        panOnDrag={false} preventScrolling={false} proOptions={{hideAttribution:true}} onNodeClick={(_,node)=>setSelected(node.id)}/>
    </div></FlowBoundary>}
    <p className="docs-caption">组件演示 · 同一数据的文字流程可用键盘选择。</p>
    <ol className="docs-flow-equivalent">{list.map(item=><li key={item.id}><button
      type="button" aria-pressed={selected===item.id} onClick={()=>setSelected(item.id)}>{item.label}</button></li>)}</ol>
    {selected&&<p className="docs-node-explanation" role="status">{explanations[selected]}</p>}
    <div className="docs-response"><span>当前分支</span><code>{scenario==='success'?'200 · {"label":"component-preview"}':scenario==='missing'?'404 · {"detail":"Not Found"}':'连接失败 · 无 HTTP 响应'}</code></div>
    <noscript><p>当前成功路径：客户端 → 服务节点 → 路由节点 → 处理函数返回字典 → JSON响应。未匹配路径返回404，停止后连接失败。</p></noscript>
  </div>;
}
