import { DocsAccordion, DocsCallout, DocsSection } from "@/components/docs/document-primitives";
import { LessonCode } from "@/components/docs/lesson-code";
import { LessonDiagram } from "@/components/docs/lesson-diagram";
import type { DocTarget } from "@/lib/framework/types";

export const introduction = "先看懂浏览器发了什么、服务器回了什么。掌握这条往返路径后，下一章再准备编写接口的环境。";

export const targets: DocTarget[] = [
  { id: "client-and-server", title: "谁发请求，谁给响应", level: 2 },
  { id: "read-an-address", title: "把地址拆开看", level: 2 },
  { id: "read-a-request", title: "读懂一条请求", level: 2 },
  { id: "read-a-response", title: "读懂一条响应", level: 2 },
  { id: "change-one-condition", title: "只改变一个条件", level: 2 },
  { id: "explain-the-round-trip", title: "用自己的话回讲", level: 2 },
];

export default function HttpRequestResponse() {
  return <>
    <DocsCallout kind="note" title="本章先阅读消息">
      <p>不需要安装 Python、HTTP 客户端或任何包。下面的请求与响应是标明用途的教学示意，尚未运行本地接口；不要把它们当作你电脑已经收到的结果。</p>
    </DocsCallout>

    <DocsSection id="client-and-server" title="谁发请求，谁给响应">
      <p>打开一个网页时，浏览器需要向另一个程序索取内容。发起请求的程序叫<strong>客户端</strong>；接收请求、处理并返回结果的程序叫<strong>服务器</strong>。这里的“服务器”既可以指运行程序的机器，也可以指提供服务的程序。本课讨论请求时，主要指后者。</p>
      <p><strong>HTTP</strong> 是双方约定的消息规则：客户端表达想做什么，服务器用规定的格式说明处理结果。<strong>API</strong> 是供程序使用的接口，例如“给我一条问候消息”；它可以通过 HTTP 提供，返回数据供客户端继续使用。</p>
      <p>先预测：客户端发出请求后，服务器要返回的是一个 Python 源文件，还是这次操作的结果？沿着图中的两条消息看一遍。</p>
      <LessonDiagram kind="http" />
      <p>在这个例子里，客户端收到的是<strong>响应消息</strong>，其中包含状态和数据。源文件是作者用来实现处理逻辑的材料，通常不会因为调用 API 就发送给客户端。</p>
      <p>运行中的程序叫<strong>进程</strong>。一个 Python 文件保存在磁盘上，并不意味着某个进程已经在接收请求。后面我们会先写文件，再启动负责接收请求的进程。</p>
    </DocsSection>

    <DocsSection id="read-an-address" title="把地址拆开看">
      <p>用地址 <code>http://127.0.0.1:8000/hello?name=Lin</code> 来定位一次访问。它由几部分组成，每部分解决一个问题：</p>
      <div className="docs-table-wrap"><table>
        <thead><tr><th scope="col">部分</th><th scope="col">含义</th><th scope="col">本例</th></tr></thead>
        <tbody>
          <tr><td>协议</td><td>使用什么通信规则</td><td><code>http</code>；<code>https</code> 会在 HTTP 通信外增加加密保护</td></tr>
          <tr><td>主机</td><td>找哪台机器</td><td><code>127.0.0.1</code> 指当前这台电脑自身</td></tr>
          <tr><td>端口</td><td>找机器上的哪个监听入口</td><td><code>8000</code> 是本例约定的入口编号</td></tr>
          <tr><td>路径</td><td>访问哪个接口位置</td><td><code>/hello</code></td></tr>
          <tr><td>查询参数</td><td>随地址附带的小项数据</td><td><code>name=Lin</code>；<code>?</code> 表示查询部分开始</td></tr>
        </tbody>
      </table></div>
      <p>端口不是文件夹；路径也不一定对应磁盘上的文件。服务器程序决定哪些路径有效，以及每条路径如何处理。多个查询参数之间通常用 <code>&amp;</code> 分隔，例如 <code>?name=Lin&amp;language=zh</code>。</p>
      <p>如果把端口改成 <code>9000</code>，会寻找另一处入口；如果只把 <code>name=Lin</code> 改成 <code>name=Mei</code>，主机、端口和路径都没有改变，只改了传给同一个接口的数据。</p>
    </DocsSection>

    <DocsSection id="read-a-request" title="读懂一条请求">
      <p>为了阅读消息，暂时约定示意服务器提供 <code>/hello</code>：它读取 <code>name</code> 并返回问候。下面按 HTTP/1.1 的文本形式展示一条请求。文件顶部的说明是教材注释，不是发送给服务器的 HTTP 字段。</p>
      <LessonCode id="f01-request-message" source="f01-request" start={1} end={6} label="HTTP 请求 A · 示意" language="http" />
      <p>请求的第一行称为<strong>请求行</strong>。<code>GET</code> 是<strong>方法</strong>，表示这次请求希望读取内容；后面是路径和查询部分；<code>HTTP/1.1</code> 表示此处使用的消息版本。</p>
      <p>接下来的 <code>名称: 值</code> 是<strong>请求头</strong>，用于附带说明。<code>Host</code> 指明目标主机和端口；<code>Accept: application/json</code> 表达客户端希望收到 JSON。这个希望是否满足，仍取决于服务器。</p>
      <p>请求头后面的一行空行把头部与<strong>正文</strong>分开。正文用来携带消息内容；本例的读取请求没有正文，名字放在查询参数里。以后提交表单或 JSON 时，正文会承担不同的数据输入。</p>
      <DocsAccordion title="方法不止 GET">
        <p><code>POST</code> 常用来提交或创建，<code>PATCH</code> 常用来修改一部分内容，<code>DELETE</code> 常用来删除。方法表达操作意图，但具体能做什么由接口约定决定。本章只读 <code>GET</code>，这些方法会在需要时逐个实践。</p>
      </DocsAccordion>
      <p>先找出三个位置：客户端希望读取什么操作？名字从哪里传入？客户端希望收到什么格式？分别看请求行中的 <code>GET</code>、查询里的 <code>name</code> 和 <code>Accept</code> 请求头。</p>
    </DocsSection>

    <DocsSection id="read-a-response" title="读懂一条响应">
      <p>现在阅读与这条请求配对的成功响应示意。它的头部和正文也由空行隔开：</p>
      <LessonCode id="f01-response-message" source="f01-response" start={1} end={5} label="HTTP 响应 A · 示意" language="http" />
      <p>响应第一行称为<strong>状态行</strong>。<code>200</code> 是<strong>状态码</strong>，告诉客户端这次读取成功；<code>OK</code> 是该状态的简短说明。状态码可以先帮助你判断处理结果，正文再给出具体数据。</p>
      <p><code>Content-Type: application/json</code> 是<strong>响应头</strong>，说明正文采用 JSON 格式。它与请求中的 <code>Accept</code> 方向不同：前者说明实际返回了什么，后者表达客户端希望得到什么。</p>
      <p><strong>JSON</strong> 是一种文本数据格式。本例的花括号表示对象，<code>"message"</code> 是字段名，冒号后是字段值。字段名和字符串使用双引号；JSON 也能表示数字、数组、<code>true</code>、<code>false</code> 和 <code>null</code>。</p>
      <p>Python 里的字典也用花括号，但它是程序中的数据结构。JSON 是消息正文里的文本格式。两者可以转换，不能因为外观相似就当成同一种东西。</p>
      <DocsCallout kind="tip" title="先状态，再数据">
        <p>排查响应时，先确认收到的是 HTTP 响应以及状态码，再核对 <code>Content-Type</code> 和正文。只看到 JSON，并不能断定操作成功；失败也可以用 JSON 返回说明。</p>
      </DocsCallout>
    </DocsSection>

    <DocsSection id="change-one-condition" title="只改变一个条件">
      <p>先不要运行命令。保持主机和端口不变，把路径从 <code>/hello</code> 改成 <code>/missing</code>。假设服务器没有提供这个路径，你认为它还能返回正常问候吗？</p>
      <LessonCode id="f01-missing-request" source="f01-request" start={8} end={12} label="HTTP 请求 B · 示意" language="http" />
      <p>在下面的教材约定中，服务器能够接收请求，但找不到对应路径，于是返回 <code>404 Not Found</code>，正文说明没有找到。这是一条<strong>失败的 HTTP 响应</strong>，不是“没有服务器响应”。</p>
      <LessonCode id="f01-missing-response" source="f01-response" start={8} end={12} label="HTTP 响应 B · 示意" language="http" />
      <p>如果停止接收请求的进程，再访问同一地址，情况就不同了：客户端可能报告“连接被拒绝”或超时，根本收不到 HTTP 状态码。此时应先检查服务是否启动、主机和端口是否正确；路径问题则应在连接成功后检查。</p>
      <div className="docs-table-wrap"><table>
        <thead><tr><th scope="col">只改变这一项</th><th scope="col">预期观察</th><th scope="col">恢复方向</th></tr></thead>
        <tbody>
          <tr><td>查询值改成 <code>Mei</code></td><td>仍访问 <code>/hello</code>；按本例约定，问候里的名字改变</td><td>把查询值改回 <code>Lin</code></td></tr>
          <tr><td>路径改成 <code>/missing</code></td><td>收到 <code>404</code> 响应</td><td>核对并改回有效路径</td></tr>
          <tr><td>接收请求的进程停止</td><td>可能连接失败，没有 HTTP 状态码</td><td>核对监听入口并重新启动服务</td></tr>
        </tbody>
      </table></div>
      <p>这些是本章的预测练习，尚不是你的本地运行记录。完成环境准备和第一个应用后，我们会在真实终端里做同样的对照。</p>
    </DocsSection>

    <DocsSection id="explain-the-round-trip" title="用自己的话回讲">
      <p>不用背完整协议，能够把一次访问拆成地址、请求和响应，就已经达成本章目标。请先口头回答，再展开核对：</p>
      <ol>
        <li>客户端与服务器分别做什么？</li>
        <li><code>8000</code>、<code>/hello</code> 和 <code>name=Lin</code> 各解决什么问题？</li>
        <li><code>Accept</code> 与 <code>Content-Type</code> 的方向有什么区别？</li>
        <li>收到 <code>404</code> 与连接失败，为什么应该检查不同的地方？</li>
      </ol>
      <DocsAccordion title="核对你的解释">
        <p>客户端发起请求；服务器接收、处理并返回响应。端口选择监听入口，路径选择接口位置，查询参数给接口附带数据。<code>Accept</code> 表达期望的响应格式，<code>Content-Type</code> 说明实际正文格式。<code>404</code> 表示已收到 HTTP 响应但路径未找到；连接失败时，先检查进程、主机和端口。</p>
      </DocsAccordion>
      <p>下一步准备 Python、项目目录和解释器。它们决定我们将来写在哪里、用哪个程序运行，以及依赖包安装到哪里。</p>
    </DocsSection>
  </>;
}
