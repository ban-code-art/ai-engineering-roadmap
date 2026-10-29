import { useId, type ReactNode } from "react";

type DiagramKind = "http" | "environment" | "python";
type Line = { text: string; mono?: boolean; muted?: boolean };

interface BoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines?: Line[];
  accent?: boolean;
  centered?: boolean;
}

/** Text is laid out explicitly, so Chinese labels remain readable in both layouts. */
function Box({ x, y, width, height, title, lines = [], accent = false, centered = false }: BoxProps) {
  const textX = centered ? x + width / 2 : x + 16;
  const anchor = centered ? "middle" : "start";
  return <g className="docs-lesson-diagram-node" data-accent={accent}>
    <rect x={x} y={y} width={width} height={height} rx={12} />
    <text className="docs-lesson-diagram-title" x={textX} y={y + 28} textAnchor={anchor}>{title}</text>
    {lines.map((line, index) => <text
      key={`${index}-${line.text}`}
      className={`docs-lesson-diagram-label${line.mono ? " docs-lesson-diagram-mono" : ""}${line.muted ? " docs-lesson-diagram-muted" : ""}`}
      x={textX}
      y={y + 52 + index * 24}
      textAnchor={anchor}
    >{line.text}</text>)}
  </g>;
}

function Arrow({ d, marker, accent = false, dashed = false }: { d: string; marker: string; accent?: boolean; dashed?: boolean }) {
  return <path
    className="docs-lesson-diagram-arrow"
    data-accent={accent}
    data-dashed={dashed}
    d={d}
    markerEnd={`url(#${marker})`}
  />;
}

function Canvas({ id, compact, height, title, description, children }: {
  id: string;
  compact: boolean;
  height: number;
  title: string;
  description: string;
  children: (markers: { normal: string; accent: string }) => ReactNode;
}) {
  const suffix = compact ? "compact" : "wide";
  const prefix = `${id}-${suffix}`;
  const markers = { normal: `${prefix}-arrow`, accent: `${prefix}-accent-arrow` };
  return <svg
    className={`docs-lesson-diagram-svg docs-lesson-diagram-${suffix}`}
    viewBox={`0 0 ${compact ? 280 : 600} ${height}`}
    role="img"
    aria-labelledby={`${prefix}-title ${prefix}-description`}
    focusable="false"
  >
    <title id={`${prefix}-title`}>{title}</title>
    <desc id={`${prefix}-description`}>{description}</desc>
    <defs>
      <marker id={markers.normal} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
        <path className="docs-lesson-diagram-marker" d="M0 0L8 4L0 8Z" />
      </marker>
      <marker id={markers.accent} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
        <path className="docs-lesson-diagram-marker" data-accent="true" d="M0 0L8 4L0 8Z" />
      </marker>
    </defs>
    {children(markers)}
  </svg>;
}

function HttpDiagram({ id }: { id: string }) {
  const description = "客户端把方法、请求目标、请求头和可选正文发给服务端。服务端返回状态、响应头和可选正文。箭头表示消息方向，图中内容是结构示意，没有发送真实请求。";
  return <>
    <Canvas id={id} compact={false} height={432} title="HTTP：一轮请求与响应" description={description}>
      {({ normal, accent }) => <>
        <Box x={24} y={24} width={144} height={76} title="客户端" lines={[{ text: "例如浏览器", muted: true }]} centered />
        <Box x={432} y={24} width={144} height={76} title="服务端" lines={[{ text: "正在监听的进程", muted: true }]} centered />
        <path className="docs-lesson-diagram-lifeline" d="M96 112V408M504 112V408" />
        <Arrow d="M96 184H504" marker={accent} accent />
        <Box x={152} y={128} width={296} height={124} title="01  请求 →" accent lines={[
          { text: "方法 + 路径 + 可选查询参数" },
          { text: "请求头：Host、Accept", mono: true },
          { text: "空行之后：可选的请求正文", muted: true },
        ]} />
        <Arrow d="M504 332H96" marker={normal} />
        <Box x={152} y={276} width={296} height={124} title="02  ← 响应" lines={[
          { text: "状态行：例如 200 OK", mono: true },
          { text: "响应头：Content-Type", mono: true },
          { text: "空行之后：可选的响应正文", muted: true },
        ]} />
      </>}
    </Canvas>
    <Canvas id={id} compact height={652} title="HTTP：一轮请求与响应" description={description}>
      {({ normal, accent }) => <>
        <Box x={24} y={16} width={232} height={64} title="客户端" lines={[{ text: "例如浏览器", muted: true }]} centered />
        <Arrow d="M140 80V112" marker={accent} accent />
        <Box x={24} y={120} width={232} height={124} title="01  请求" accent lines={[
          { text: "方法 + 路径 + 查询参数" },
          { text: "请求头：Host、Accept", mono: true },
          { text: "空行之后：可选的正文", muted: true },
        ]} />
        <Arrow d="M140 244V276" marker={accent} accent />
        <Box x={24} y={284} width={232} height={64} title="服务端" lines={[{ text: "接收请求，形成响应", muted: true }]} centered />
        <Arrow d="M140 348V380" marker={normal} />
        <Box x={24} y={388} width={232} height={124} title="02  响应" lines={[
          { text: "状态：例如 200 OK", mono: true },
          { text: "响应头：Content-Type", mono: true },
          { text: "空行之后：可选的正文", muted: true },
        ]} />
        <Arrow d="M140 512V544" marker={normal} />
        <Box x={24} y={552} width={232} height={64} title="回到同一个客户端" lines={[{ text: "读取状态与正文", muted: true }]} centered />
      </>}
    </Canvas>
  </>;
}

function EnvironmentDiagram({ id }: { id: string }) {
  const description = "PyCharm运行配置与终端命令是两个入口。两个入口都要分别核对工作目录和Python解释器。工作目录影响相对文件路径，解释器决定使用哪套环境和包。选择工作目录不会自动选择解释器。";
  return <>
    <Canvas id={id} compact={false} height={436} title="环境：两个入口，两项独立设置" description={description}>
      {({ normal, accent }) => <>
        <Box x={24} y={24} width={252} height={76} title="PyCharm" lines={[{ text: "运行配置", muted: true }]} centered />
        <Box x={324} y={24} width={252} height={76} title="PowerShell 终端" lines={[{ text: "执行命令", muted: true }]} centered />
        <path className="docs-lesson-diagram-arrow" d="M150 100V128H450V100" />
        <text className="docs-lesson-diagram-label" x={300} y={153} textAnchor="middle">两个入口都要分别核对</text>
        <Arrow d="M150 128V184" marker={normal} />
        <Arrow d="M450 128V184" marker={accent} accent />
        <Box x={24} y={192} width={252} height={88} title="工作目录" lines={[
          { text: "fastapi-study/", mono: true },
          { text: "相对路径从这里开始", muted: true },
        ]} />
        <Box x={324} y={192} width={252} height={88} title="Python 解释器" accent lines={[
          { text: ".venv\\Scripts\\python.exe", mono: true },
          { text: "明确使用项目虚拟环境", muted: true },
        ]} />
        <Arrow d="M150 280V312" marker={normal} />
        <Arrow d="M450 280V312" marker={accent} accent />
        <Box x={24} y={320} width={252} height={88} title="找到项目根中的文件" lines={[{ text: "check_environment.py", mono: true }]} />
        <Box x={324} y={320} width={252} height={88} title="使用这个环境中的包" lines={[
          { text: "FastAPI / Uvicorn", mono: true },
          { text: "包含 Pydantic 等依赖", muted: true },
        ]} accent />
      </>}
    </Canvas>
    <Canvas id={id} compact height={496} title="环境：两个入口，两项独立设置" description={description}>
      {({ normal }) => <>
        <Box x={16} y={16} width={116} height={56} title="PyCharm" centered />
        <Box x={148} y={16} width={116} height={56} title="终端" centered />
        <path className="docs-lesson-diagram-arrow" d="M74 72V100H206V72" />
        <Arrow d="M140 100V128" marker={normal} />
        <text className="docs-lesson-diagram-label" x={140} y={158} textAnchor="middle">两个入口都分别核对</text>
        <rect className="docs-lesson-diagram-boundary" x={12} y={180} width={256} height={266} rx={16} />
        <Box x={24} y={196} width={232} height={88} title="工作目录：项目根" lines={[
          { text: "fastapi-study/", mono: true },
          { text: "check_environment.py", mono: true },
        ]} />
        <Box x={24} y={308} width={232} height={120} title="解释器：项目虚拟环境" accent lines={[
          { text: ".venv\\Scripts\\", mono: true },
          { text: "python.exe", mono: true },
          { text: "使用这个环境中的包", muted: true },
        ]} />
        <text className="docs-lesson-diagram-label" x={140} y={478} textAnchor="middle">两项设置相互独立</text>
      </>}
    </Canvas>
  </>;
}

function PythonDiagram({ id }: { id: string }) {
  const description = "imports.py先打印before import，然后首次导入messages模块。messages.py执行顶层，打印messages: loaded，def创建函数对象但没有执行函数体。导入完成后imports.py打印after import，再调用make_message。调用时函数体才执行，返回Hello, Lin。";
  return <>
    <Canvas id={id} compact={false} height={480} title="Python：模块加载与函数调用" description={description}>
      {({ normal, accent }) => <>
        <Box x={24} y={24} width={252} height={88} title="01  imports.py" lines={[
          { text: "打印 before import", mono: true },
          { text: "执行 from … import 语句", muted: true },
        ]} />
        <Arrow d="M276 68H316" marker={normal} />
        <Box x={324} y={24} width={252} height={88} title="02  messages.py 首次加载" lines={[
          { text: "执行模块顶层语句", muted: true },
          { text: "打印 messages: loaded", mono: true },
        ]} />
        <Arrow d="M450 112V152" marker={normal} />
        <Box x={324} y={160} width={252} height={88} title="03  遇到 def make_message" lines={[
          { text: "创建函数对象", muted: true },
          { text: "此时不执行函数体" },
        ]} />
        <Arrow d="M324 204H284" marker={normal} />
        <Box x={24} y={160} width={252} height={88} title="04  import 完成" lines={[
          { text: "主程序继续往下执行", muted: true },
          { text: "打印 after import", mono: true },
        ]} />
        <Arrow d="M150 248V304" marker={accent} accent />
        <text className="docs-lesson-diagram-label" x={170} y={284}>开始一次调用</text>
        <Box x={24} y={312} width={252} height={88} title="05  显式调用函数" accent lines={[
          { text: 'make_message("Lin")', mono: true },
          { text: "传入本次使用的参数", muted: true },
        ]} />
        <Arrow d="M276 356H316" marker={accent} accent />
        <Box x={324} y={312} width={252} height={88} title="06  执行函数体" accent lines={[
          { text: "产生 Hello, Lin", mono: true },
          { text: "return 把结果交回调用处", muted: true },
        ]} />
        <Arrow d="M450 400V440H150V408" marker={accent} accent dashed />
        <text className="docs-lesson-diagram-label" x={300} y={464} textAnchor="middle">返回值交给 print，显示 Hello, Lin</text>
      </>}
    </Canvas>
    <Canvas id={id} compact height={752} title="Python：模块加载与函数调用" description={description}>
      {({ normal, accent }) => <>
        <Box x={24} y={16} width={232} height={88} title="01  imports.py" lines={[
          { text: "打印 before import", mono: true },
          { text: "执行导入语句", muted: true },
        ]} />
        <Arrow d="M140 104V132" marker={normal} />
        <Box x={24} y={140} width={232} height={88} title="02  加载 messages.py" lines={[
          { text: "执行模块顶层语句", muted: true },
          { text: "打印 messages: loaded", mono: true },
        ]} />
        <Arrow d="M140 228V256" marker={normal} />
        <Box x={24} y={264} width={232} height={88} title="03  遇到 def" lines={[
          { text: "创建 make_message 函数" },
          { text: "此时不执行函数体", muted: true },
        ]} />
        <Arrow d="M140 352V380" marker={normal} />
        <Box x={24} y={388} width={232} height={88} title="04  import 完成" lines={[
          { text: "主程序继续往下执行", muted: true },
          { text: "打印 after import", mono: true },
        ]} />
        <Arrow d="M140 476V504" marker={accent} accent />
        <Box x={24} y={512} width={232} height={88} title="05  显式调用函数" accent lines={[
          { text: 'make_message("Lin")', mono: true },
          { text: "传入本次使用的参数", muted: true },
        ]} />
        <Arrow d="M140 600V628" marker={accent} accent />
        <Box x={24} y={636} width={232} height={88} title="06  执行函数体并返回" accent lines={[
          { text: "返回值：Hello, Lin", mono: true },
          { text: "交给调用处的 print 显示", muted: true },
        ]} />
      </>}
    </Canvas>
  </>;
}

const diagramInfo: Record<DiagramKind, { title: string; caption: string; equivalent: string[] }> = {
  http: {
    title: "一轮 HTTP 消息",
    caption: "箭头表示消息方向。字段是结构示意，200 只是一种可能的状态；图没有发送真实请求。",
    equivalent: [
      "客户端发出请求：请求行包含方法与目标，请求头提供补充信息；空行之后可以有请求正文。",
      "正在监听的服务端接收请求，决定如何回应。",
      "服务端发回响应：状态行说明结果，响应头描述消息，空行之后可以有响应正文。",
      "客户端读取响应。收到404等HTTP状态也说明已经收到服务端消息；连接失败时收不到这条响应。",
    ],
  },
  environment: {
    title: "两个入口，两项独立设置",
    caption: "这是 Windows 主线的环境关系示意。macOS / Linux 使用 .venv/bin/python；工作目录与解释器都要单独核对。",
    equivalent: [
      "终端和PyCharm运行配置是两个独立入口。不要假定在一个入口选好了环境，另一个入口会自动同步。",
      "工作目录设置为fastapi-study项目根，check_environment.py放在这个根目录中，相对路径从这里计算。",
      "解释器选择项目内.venv中的Python。解释器对应的环境决定从哪里导入FastAPI、Uvicorn与Pydantic。",
      "改变工作目录不会自动改变解释器。检查脚本会分别检查这两项，输出当前设置。",
    ],
  },
  python: {
    title: "先加载模块，再调用函数",
    caption: "对应 imports.py 与 messages.py 的首次导入示意。def 创建函数；显式调用时才执行函数体。",
    equivalent: [
      "imports.py先打印imports: before import，然后执行from messages import make_message。",
      "首次加载messages.py时，Python执行模块顶层，先打印messages: loaded。",
      "执行def语句会创建make_message函数对象；此时没有执行它缩进的函数体。",
      "导入完成，imports.py继续向下执行，打印imports: after import。",
      "执行make_message('Lin')，参数进入本次调用，函数体产生返回值Hello, Lin。",
      "return把值交回调用位置；外层print显示Hello, Lin。后续同一进程的普通再次导入通常复用已加载模块。",
    ],
  },
};

/** Static SVG and native details retain the explanation when JavaScript is disabled. */
export function LessonDiagram({ kind }: { kind: DiagramKind }) {
  const id = `lesson-diagram-${useId().replaceAll(":", "")}`;
  const info = diagramInfo[kind];
  return <figure className="docs-lesson-diagram" data-diagram-kind={kind}>
    <div className="docs-lesson-diagram-heading">
      <span className="docs-lesson-diagram-eyebrow">结构示意</span>
      <strong>{info.title}</strong>
    </div>
    <div className="docs-lesson-diagram-canvas">
      {kind === "http" ? <HttpDiagram id={id} /> : kind === "environment" ? <EnvironmentDiagram id={id} /> : <PythonDiagram id={id} />}
    </div>
    <figcaption>{info.caption}</figcaption>
    <details className="docs-lesson-diagram-equivalent">
      <summary>查看流程的文字说明</summary>
      <ol>{info.equivalent.map((item) => <li key={item}>{item}</li>)}</ol>
    </details>
  </figure>;
}
