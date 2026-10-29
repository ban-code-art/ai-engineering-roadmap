import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/docs-shell";
import { CodeGroup } from "@/components/docs/code-group";
import { DocsSection, DocsCallout, DocsAccordion, DocsSteps, CopyPageButton } from "@/components/docs/document-primitives";
import { FrameworkTools } from "@/components/docs/framework-tools";
import { highlightSample } from "@/lib/framework/highlight";
import { loadFixture } from "@/lib/framework/fixtures";
import { getSearchEntries, previewTargets } from "@/lib/framework/registry";
import { exportDocumentText } from "@/lib/framework/document-export";

export const metadata = {title:"文档组件预览",robots:{index:false,follow:false}};

export default async function FrameworkPreview() {
  if(process.env.ENABLE_FRAMEWORK_PREVIEW!=="1")notFound();
  const [base,uppercase,extended] = await Promise.all([loadFixture("base"),loadFixture("uppercase"),loadFixture("extended")]);
  const short = await highlightSample({id:"snippet",label:"局部片段",code:base.code.split("\n").slice(1).join("\n"),sourcePath:base.sourcePath,sourceHash:base.sourceHash,checkpoint:"base"});
  const windows = await highlightSample({id:"windows",label:"PowerShell",code:"npm.cmd run dev"},"shellscript");
  const unix = await highlightSample({id:"unix",label:"macOS / Linux",code:"npm run dev"},"shellscript");
  const content=<>
    <div className="docs-prose docs-intro"><p>这是一页纯文档组件样例，用于验证排版、代码、目录、提示、图形与文件工具。它不是基础教程或项目教程。</p></div>
    <DocsCallout kind="note" title="内部组件预览"><p>旧教材已经移除，正式内容将重新编写。基础教程和项目实践统一复用这套文档框架。</p></DocsCallout>
    <DocsSection id="introduction" title="从连续阅读开始">
      <p>页面保留全部小节。目录只定位阅读位置，代码标签与局部图形只改变自身状态，其他小节始终可读。</p>
      <DocsCallout kind="tip" title="统一阅读体验"><p>不同栏目使用同一组标题、正文、代码与提示组件，让作者专注内容，让读者保持熟悉的操作方式。</p></DocsCallout>
    </DocsSection>
    <DocsSection id="typography" title="文字与信息层级">
      <p>这一段用于检查中文行宽与行距。文档采用清楚的标题层级、连续解释与有意义的辅助区域；正文不被多层面板包围，长代码拥有自己的滚动区域。</p>
      <h3>组件数据与内容分离</h3><p>组件决定怎样呈现，内容决定讲什么。基础教程和项目实践共享相同外观，章节、文件和示例数据分别维护。</p>
      <div className="docs-table-wrap"><table><thead><tr><th>组件</th><th>负责什么</th><th>独立状态</th></tr></thead><tbody><tr><td>目录</td><td>定位当前小节</td><td>阅读位置</td></tr><tr><td>代码组</td><td>呈现与复制源码</td><td>当前标签</td></tr><tr><td>图形</td><td>说明局部关系</td><td>选中节点</td></tr></tbody></table></div>
    </DocsSection>
    <DocsSection id="code" title="代码与完整版本">
      <p>以下Python文件仅作为组件测试素材，不构成教程。局部片段和完整文件来自同一份真实样例文件，复制保留换行和注释。</p>
      <CodeGroup id="route-example" title="sample.py" samples={[short,base]}/>
      <DocsAccordion title="对照独立版本"><CodeGroup id="message-example" title="大写变体" samples={[uppercase]}/><CodeGroup id="path-example" title="扩展变体" samples={[extended]}/>
        <DocsAccordion title="查看基础版本"><CodeGroup id="recovery-example" title="基础样例" samples={[base]}/></DocsAccordion></DocsAccordion>
    </DocsSection>
    <DocsSection id="commands" title="命令与操作步骤">
      <p>下面是命令代码组样例。切换操作系统标签只改变这个代码组，不改变目录、正文或其他文件视图。</p>
      <CodeGroup id="start-command" title="开发命令样例" samples={[windows,unix]}/>
      <DocsSteps items={[{title:"查看",body:<p>阅读当前样例与说明。</p>},{title:"选择",body:<p>切换局部标签并观察明确变化。</p>},{title:"核对",body:<p>复制内容，确认注释和换行保持原样。</p>}]} />
    </DocsSection>
    <DocsSection id="callouts" title="提示与展开">
      <p>提示类型具有明确语义，正文解释直接呈现；额外核对信息可放在原生展开区域。</p>
      <DocsCallout kind="warning" title="样例不是教程完成状态"><p>组件功能通过检查不能代表未来教程内容或学习效果通过验收。</p></DocsCallout>
      <DocsCallout kind="info" title="资料来源"><p>样例来自仓库内的fixtures，字体和静态资源随站点交付。</p></DocsCallout>
      <DocsAccordion title="查看展开组件"><p>这个区域仅显示当前可选说明，不替换其他章节。</p></DocsAccordion>
      <DocsAccordion title="查看danger提示组件"><DocsCallout kind="danger" title="严重后果样式"><p>本区域仅验证组件外观，未执行任何操作。</p></DocsCallout></DocsAccordion>
    </DocsSection>
    <DocsSection id="files" title="看清文件位置"><p>目录工具展示当前组件样例的位置、来源与版本。选择文件只影响本区域。</p><FrameworkTools samples={[base,uppercase,extended]}/></DocsSection>
    <DocsSection id="flow" title="把关系放回流程里"><p>这幅图用于验证成功、失败、节点选择和键盘交互，不记录任何真实接口调用。</p><FrameworkTools samples={[base]} flowOnly/></DocsSection>
    <DocsSection id="verification" title="验证与资料来源"><p>视觉规则来自LangChain官方文档对照。完整课程将在这套统一模板中重新编写。</p>
      <DocsAccordion title="查看字体说明"><p>本地字体采用Inter、IBM Plex Mono和Noto Sans SC。标题使用开源Manrope，未再分发受限TWK Lausanne。</p></DocsAccordion>
      <p><a href="https://docs.langchain.com/oss/python/langchain/quickstart" target="_blank" rel="noreferrer">官方文档参考 ↗</a> · <a href="https://github.com/ban-code-art/ai-engineering-roadmap" target="_blank" rel="noreferrer">项目仓库 ↗</a></p>
    </DocsSection>
  </>;
  return <DocsShell section="preview" title="文档组件预览" targets={previewTargets} searchEntries={getSearchEntries(true)}>
    <div className="docs-breadcrumb">内部样例</div><div className="docs-page-heading"><h1>文档组件预览</h1><CopyPageButton text={'文档组件预览\n\n'+exportDocumentText(content,{excludeTypes:[DocsAccordion]})}/></div>{content}
  </DocsShell>;
}
