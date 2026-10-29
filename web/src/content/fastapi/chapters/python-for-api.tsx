import { DocsAccordion, DocsCallout, DocsSection } from "@/components/docs/document-primitives";
import { LessonCode } from "@/components/docs/lesson-code";
import { LessonCommands } from "@/components/docs/lesson-commands";
import { LessonDiagram } from "@/components/docs/lesson-diagram";
import type { DocTarget } from "@/lib/framework/types";

export const introduction = "用几个短脚本读懂赋值、函数、字典、导入和类型提示。先能解释普通 Python 怎么运行，再学习 FastAPI 怎么使用这些能力。";

export const targets: DocTarget[] = [
  { id: "prepare-small-scripts", title: "准备几个小脚本", level: 2 },
  { id: "define-and-call", title: "定义函数，再调用它", level: 2 },
  { id: "keep-related-data", title: "用字典与列表保存数据", level: 2 },
  { id: "load-a-module", title: "导入模块与调用函数", level: 2 },
  { id: "read-type-hints", title: "类型提示会做什么", level: 2 },
  { id: "register-a-function", title: "先认识函数登记", level: 2 },
  { id: "explain-the-script", title: "修改、恢复与回讲", level: 2 },
];

export default function PythonForApi() {
  return <>
    <DocsCallout kind="note" title="前置与依赖">
      <p>先完成上一章的解释器与环境检查。本章不需要再安装第三方包；<code>print</code>、<code>str</code>、<code>int</code>、<code>dict</code> 和 <code>list</code> 都由 Python 提供。唯一的业务导入是我们自己编写的 <code>messages.py</code>。</p>
      <p>运行命令默认展示 <strong>Windows · PowerShell</strong>。macOS / Linux 请切换到对应标签；两种系统运行同一份 Python 文件，解释器入口和路径写法不同。</p>
    </DocsCallout>

    <DocsSection id="prepare-small-scripts" title="准备几个小脚本">
      <p>回到上一章建立的 <code>fastapi-study</code> 项目根。在 PyCharm 左侧项目树中，新建目录 <code>python-basics</code>，每学到一个例子，再在该目录创建对应的 <code>.py</code> 文件。目录专门存放本章实验，不要把文件放进 <code>.venv</code>。</p>
      <p>本章依次编写 <code>functions.py</code>、<code>containers.py</code>、<code>messages.py</code>、<code>imports.py</code> 和 <code>annotations.py</code>。最后的 <code>decorators.py</code> 是可选实验；先学完前五个再展开。</p>
      <p>每个例子写好后，从项目根调用环境里的 Python，把 <code>python-basics</code> 下的脚本路径作为参数传进去。下文逐节给出命令；每次只执行当前文件的那一行。macOS / Linux 使用同一份 Python 文件，按系统标签选用对应的解释器入口和路径写法。</p>
      <p>在编辑器里修改但没有保存，终端运行的仍是磁盘上的旧内容。每次练习都按“修改 → 保存 → 运行 → 对照输出”来做。</p>
    </DocsSection>

    <DocsSection id="define-and-call" title="定义函数，再调用它">
      <p>先在项目根的 <code>python-basics\functions.py</code> 写入这个完整的小例子；macOS/Linux 对应路径为 <code>python-basics/functions.py</code>。它只做一件事：根据名字生成一句问候，并把返回结果显示在终端。</p>
      <LessonCode id="f03-functions" source="f03-functions" label="functions.py" language="python" highlightLines={[5,7,10]} />
      <p><code>=</code> 是<strong>赋值</strong>：先得到右边的值，再让左边的名称引用它。名称是变量；带引号的 <code>"Lin"</code> 是字符串，也就是一段文本。赋值不是数学里的相等判断。</p>
      <p><code>def</code> 开始<strong>定义函数</strong>。函数是一个有名称、可以被调用的小操作；括号里的 <code>name</code> 是它接收输入的参数。参数后的 <code>: str</code> 表示期望输入字符串，<code>-&gt; str</code> 表示期望返回字符串。这两处是类型提示，后面会单独验证它们的边界。</p>
      <p>定义行末尾的冒号引出<strong>函数体</strong>，下一行向右缩进四个空格，表示它属于这个函数。<code>return</code> 把结果交给调用者，并结束本次函数执行。<code>#</code> 后面是注释，给读代码的人解释原因，不参与执行。</p>
      <p><code>greet(...)</code> 这种“名称加括号”的写法才是<strong>调用</strong>。调用者把值传进去，函数执行后给出返回值。<code>message = greet("Lin")</code> 保存这次返回的结果，<code>print(message)</code> 再把它显示到终端。定义函数本身，不会把函数体运行一遍。</p>
      <p>定义函数像写好饮料配方，调用函数像按配方实际做一杯饮料：参数是这次提供的材料，<code>return</code> 交回做好的结果。这里的“配方”是 <code>greet</code> 的函数体，输入是名字；<code>print</code> 另负责显示结果，所以返回与显示是两个动作。</p>
      <p>函数体里的 <code>+</code> 把字符串接在一起：问候前缀、逗号与空格、传入的名字，组合成 <code>Hello, Lin</code>。先保存，再从项目根执行：</p>
      <LessonCommands id="f03-run-functions-windows" windows={{source:"f03-windows",start:5,end:5}} posix={{source:"f03-posix",start:6,end:6}} title="运行 functions.py" />
      <p>先预测：把调用处的名字改成 <code>"Mei"</code>，问候会在哪里改变？再保存并运行。输出应变成 <code>Hello, Mei</code>；函数的生成规则不需要再写一遍。</p>
      <DocsCallout kind="tip" title="一处负责一种变化">
        <p>调用处决定“给谁问候”，函数体决定“怎样生成问候”。把输入和处理规则分开，后面同一个函数就能接收不同输入。</p>
      </DocsCallout>
    </DocsSection>

    <DocsSection id="keep-related-data" title="用字典与列表保存数据">
      <p>一条任务同时有标题和完成状态，需要把相关值放在一起。<strong>字典</strong>用“键 → 值”组织数据；<strong>列表</strong>按顺序存放多项数据。先在同一目录新增 <code>containers.py</code>，保持前一个文件不变。</p>
      <LessonCode id="f03-containers" source="f03-containers" label="containers.py" language="python" />
      <p>字典用花括号 <code>{"{}"}</code>，键和值之间用冒号，多个字段之间用逗号。<code>task["title"]</code> 取得标题，<code>task["done"]</code> 取得完成状态。<code>False</code> 是表示“否”的布尔值，不带引号；对应的“是”写作 <code>True</code>。</p>
      <p>列表用方括号 <code>[]</code>，本例在 <code>titles</code> 中保存两个标题。<code>len(titles)</code> 调用 Python 内置函数，得到元素数量，因此显示 <code>2</code>。以后用 <code>titles[0]</code> 可以取得第一个元素，Python 从 <code>0</code> 开始编号。</p>
      <p>字典像一张带“姓名、电话”等字段的联系人记录，按字段名取值；列表像排好顺序的购物清单，按位置取项。因此 <code>task["title"]</code> 用键找标题，而 <code>titles[0]</code> 用位置找第一项，不能把这两种访问方式混用。</p>
      <p>这里保存的是 Python 数据。Python 布尔值写作 <code>True</code>、<code>False</code>，JSON 写作 <code>true</code>、<code>false</code>；后面由框架把需要发送的数据转换成 JSON。</p>
      <LessonCommands id="f03-run-containers-windows" windows={{source:"f03-windows",start:8,end:8}} posix={{source:"f03-posix",start:7,end:7}} title="运行 containers.py" />
      <p>输出应依次为 <code>Read the docs</code>、<code>False</code>、<code>2</code>。再把字典中的标题值改成 <code>"Practice Python"</code>，保存并重跑。应只有第一行改变；完成状态和列表长度不受影响。</p>
      <DocsAccordion title="改错键名后怎样恢复？">
        <p>故意把访问处的 <code>task["title"]</code> 改成 <code>task["titel"]</code>，会得到 <code>KeyError: 'titel'</code>。这表示查询的键不在字典里，不是 Python 没有安装好。对照字典中的实际键名，改回 <code>title</code> 后保存并重新运行。避免把字段值和字段名一起修改，否则难以定位哪个条件导致错误。</p>
      </DocsAccordion>
    </DocsSection>

    <DocsSection id="load-a-module" title="导入模块与调用函数">
      <p>现在把“生成问候”放到一个专门文件，调用它的代码放到另一个文件。一份 <code>.py</code> 文件可以作为一个<strong>模块</strong>被其他文件导入。先在 <code>python-basics</code> 下保存 <code>messages.py</code>：</p>
      <LessonCode id="f03-messages" source="f03-messages" label="messages.py · 生成消息" language="python" />
      <p>再在<strong>同一个目录</strong>保存 <code>imports.py</code>。它只负责导入并调用，不复制另一份问候规则：</p>
      <LessonCode id="f03-imports" source="f03-imports" label="imports.py · 调用入口" language="python" highlightLines={[4,7]} />
      <p><code>from messages import make_message</code> 的意思是：从 <code>messages</code> 模块取得 <code>make_message</code> 这个名称。模块名不带 <code>.py</code>。运行 <code>imports.py</code> 时，Python 会寻找并加载同目录的 <code>messages.py</code>；这不是从网上下载一个包，不需要 <code>pip install messages</code>。</p>
      <p>这像把共用配方放进一本配方册，需要时取得配方，而不是在每张订单里抄一遍。<code>messages.py</code> 保存生成规则，<code>imports.py</code> 取得 <code>make_message</code> 后再调用。要注意：Python 首次导入会执行模块的<strong>顶层语句</strong>，也就是没有放进函数体的语句；取得函数与执行函数体仍是两件事。</p>
      <p>先预测四行输出的顺序。为什么导入语句前后都会打印，而 <code>messages</code> 中的打印出现在它们之间？</p>
      <LessonCommands id="f03-run-imports-windows" windows={{source:"f03-windows",start:11,end:11}} posix={{source:"f03-posix",start:8,end:8}} title="运行 imports.py" />
      <LessonDiagram kind="python" />
      <p>运行入口从上到下执行。遇到导入时，会先加载模块并执行它的顶层语句，所以看到 <code>messages: loaded</code>；函数定义只建立函数。等入口明确调用 <code>make_message("Lin")</code>，函数体才生成并返回问候。</p>
      <p>修改 <code>messages.py</code> 中的问候文本，再运行 <code>imports.py</code>，输出应改变。这样，问候规则只有一份，调用入口不需要跟着复制或修改。</p>
      <DocsAccordion title="为什么找不到 messages？">
        <p>如果出现 <code>ModuleNotFoundError: No module named 'messages'</code>，先看两份文件是否确实在同一目录、名称是否为 <code>messages.py</code>，以及是否已保存。只创建了 <code>imports.py</code> 还不能形成完整示例；补齐提供函数的文件后，再从项目根运行入口。不要给这个错误随意安装同名第三方包。</p>
      </DocsAccordion>
    </DocsSection>

    <DocsSection id="read-type-hints" title="类型提示会做什么">
      <p>类型提示帮助编辑器和检查工具理解“希望收到什么”。常见的 <code>str</code> 表示字符串，<code>int</code> 表示整数。<code>value: int</code> 不是默认值，<code>value = 3</code> 才是赋值；冒号和等号承担不同职责。</p>
      <p>类型提示像包装上的“建议放入整数”标签，表达预期；标签本身不会挡住放入其他东西。是否真的检查，需要额外机制。回到普通 Python 函数，<code>: int</code> 可以帮助人和工具发现不一致，却不会自动充当输入检查。</p>
      <p>但普通 Python 函数的直接调用，不会因为写了 <code>: int</code> 就自动验证或转换输入。用一个只原样返回输入的函数来观察。在同一目录新增 <code>annotations.py</code>：</p>
      <LessonCode id="f03-annotations" source="f03-annotations" label="annotations.py" language="python" highlightLines={[7]} />
      <LessonCommands id="f03-run-annotations-windows" windows={{source:"f03-windows",start:14,end:14}} posix={{source:"f03-posix",start:9,end:9}} title="运行 annotations.py" />
      <p>先预测第二次调用：会抛出类型验证错误，还是显示 <code>three</code>？保存并运行后，应依次显示 <code>3</code> 和 <code>three</code>。原因是函数体原样返回传入值，普通调用没有自动验证步骤。</p>
      <p>如果函数体对输入做了只能用于某种类型的操作，错误可能来自那个操作本身。那仍然不能说明类型注解自动做了验证。FastAPI 后面会读取注解来处理 HTTP 输入；那是框架增加的行为，需要另行理解。</p>
      <p>本节的故意错类型调用用于验证边界，不是推荐的业务写法。正常调用应遵循声明的类型，编辑器标出的类型不一致也应检查。</p>
    </DocsSection>

    <DocsSection id="register-a-function" title="先认识函数登记">
      <p>下一章会出现函数上方的 <code>@</code>。先建立一个直觉：可以在<strong>定义函数时</strong>，把它交给另一段代码登记，之后再由调用者执行。登记与执行函数体是两件事。</p>
      <DocsAccordion title="可选实验：观察 @ 的登记时机">
        <p>在 <code>python-basics</code> 中新增 <code>decorators.py</code>。第一行从 Python 标准库 <code>collections.abc</code> 导入 <code>Callable</code>，不需要安装包。<code>Callable[[str], str]</code> 描述“接收一个字符串、返回一个字符串的可调用对象”；这里用来说明传入的是一个函数。</p>
        <p>这是普通 Python 实验，没有导入 FastAPI，也没有接收 HTTP 请求。先阅读全部文件，再运行它：</p>
        <LessonCode id="f03-decorators" source="f03-decorators" label="decorators.py · 普通登记实验" language="python" />
        <p><code>@register</code> 放在函数定义上方，会在定义完成时把函数交给 <code>register</code>。它取得函数、记录登记信息，再返回这个函数，保留后续调用能力。函数名称不加括号时，可以表示函数本身；加括号才调用它。<code>function.__name__</code> 读取函数的名称，所以登记行会显示 <code>hello</code>。</p>
        <LessonCommands id="f03-run-decorators-windows" windows={{source:"f03-windows",start:18,end:18}} posix={{source:"f03-posix",start:12,end:12}} title="运行 decorators.py" />
        <p>比较“已登记”和真正问候的输出顺序：登记先发生；显式调用时，问候函数体才执行。如果只删除最后一行问候调用，仍会看到 <code>registered: hello</code> 和 <code>calling now</code>，但不再显示 <code>Hello, Lin</code>。本实验只解释这个时机，不要求你现在设计自己的装饰器。</p>
      </DocsAccordion>
      <p>即使暂时跳过实验，也请记住：看到函数上方的 <code>@</code>，不能直接推断函数体已经运行。下一章会结合真实应用说明谁登记、登记在哪里，以及后续谁来调用。</p>
    </DocsSection>

    <DocsSection id="explain-the-script" title="修改、恢复与回讲">
      <p>这几个文件分别回答一个问题：函数如何调用，数据如何组织，规则如何导入，注解有什么边界。先做三次单条件练习：</p>
      <ol>
        <li>把问候的名字改掉，保存并运行；说明“输入”和“生成规则”分别在哪里。</li>
        <li>把字典访问的键名拼错，观察 <code>KeyError</code>，再恢复实际键名并重跑。</li>
        <li>把 <code>messages.py</code> 的文件名暂时改掉，运行入口观察导入错误；改回文件名并保存，确认恢复。</li>
      </ol>
      <p>如果出现 <code>IndentationError</code>，检查函数体是否统一缩进四个空格；如果出现 <code>SyntaxError</code>，先检查提示行附近的引号、冒号和括号；如果终端提示找不到脚本，先核对当前目录与传入的相对路径。不要把这些不同层面的错误都归为“包没装好”。</p>
      <DocsAccordion title="回讲检查：定义、导入、调用的区别">
        <p>定义建立函数，调用执行函数体。导入加载模块，执行其中的顶层语句，并取得需要的名称；它不会自动调用模块里的所有函数。变量引用值，字典组织带键的数据，列表组织有顺序的数据。类型提示表达预期，普通直接调用不会自动按注解校验。</p>
      </DocsAccordion>
      <p>确认能够说明这些差别后，再进入第一个 FastAPI 应用。届时会逐项解释导入、<code>FastAPI()</code>、<code>app</code> 和路由登记，不要求你从一个大文件里猜它们的作用。</p>
    </DocsSection>
  </>;
}
