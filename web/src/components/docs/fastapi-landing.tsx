import Link from "next/link";
import { DocsShell } from "./docs-shell";
import { DocsSection, DocsCallout } from "./document-primitives";
import { LessonCards } from "./lesson-cards";
import { fastapiChapters, chapterHref } from "@/content/fastapi/course";
import { sectionTargets, siteSearchEntries } from "@/content/site";

export function FastapiLanding() {
  return <DocsShell section="learn" title="FastAPI 教程" targets={sectionTargets.learn} searchEntries={siteSearchEntries}>
    <div className="docs-breadcrumb">课程教学 · FastAPI</div>
    <div className="docs-page-heading"><h1>FastAPI 教程</h1></div>
    <div className="docs-prose docs-intro"><p>从读懂一条 HTTP 请求开始，一步步把普通 Python 函数变成可使用的 API。先运行简单版本，再根据实际遇到的问题加入测试、数据库、登录和部署。</p></div>
    <DocsCallout kind="info" title="当前进度：入门准备">
      <p>第一批 3 章已发布，分别讲 HTTP、开发环境和必要 Python。后续章节逐批编写、运行与核查，结课目标是完整的 TaskBoard API。</p>
    </DocsCallout>
    <DocsSection id="start-here" title="从这里开始">
      <p>不要求先搭建后端服务。按下面的顺序学习，前一章会准备好下一章需要的概念和环境。</p>
      <LessonCards label="已发布的入门章节" cards={fastapiChapters.map((chapter,index)=>({
        title:`${chapter.id} · ${chapter.title}`,description:chapter.summary,href:chapterHref(chapter.slug),
        icon:index===0?"request":index===1?"terminal":"code",tone:index===0?"blue":index===1?"green":"amber",
      }))}/>
    </DocsSection>
    <DocsSection id="course-path" title="后续学习路线">
      <p>这门课会始终围绕同一个任务管理 API 逐步成长。先完成可运行的基础版本，再引入相应的工程习惯。</p>
      <ol>
        <li>创建第一个接口，完成请求、停止和恢复的闭环。</li>
        <li>接收和验证数据，完成内存版任务增删改查与测试。</li>
        <li>按实际需要组织模块、路由和依赖，加入 SQLite 持久化。</li>
        <li>实现注册、登录与任务归属，验收完整同步版本。</li>
        <li>学习异步与 PostgreSQL，再完善日志、客户端、附件与交付。</li>
      </ol>
      <p className="docs-caption">后续阶段为课程计划；正式导航只展示已经编写的章节。</p>
    </DocsSection>
    <DocsSection id="how-to-learn" title="怎样跟着学习">
      <p>每章先解释一个小目标，再给少量代码和可观察的结果。先预测输出，运行后对照；遇到错误先确认文件位置、解释器与命令，再使用本章完整源码恢复。</p>
      <p>每个代码块下方的“查看源码”会跳转到 GitHub 上与当前讲解一致的固定版本。基础课里的完整 demo 会随课程增长；其他独立实践可从顶部课程入口进入。</p>
      <p><Link href={chapterHref(fastapiChapters[0].slug)}>开始第一章：读懂 HTTP 请求与响应 →</Link></p>
    </DocsSection>
  </DocsShell>;
}
