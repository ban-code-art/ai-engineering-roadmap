import type { DocTarget } from "@/lib/framework/types";
import { DocsAccordion, DocsCallout, DocsSection } from "@/components/docs/document-primitives";
import { LessonCode } from "@/components/docs/lesson-code";
import { LessonDiagram } from "@/components/docs/lesson-diagram";
import { getSourceLinks } from "@/lib/course/sources";

export const introduction = "把项目目录、Python 解释器和安装的包放到正确的位置。完成后，终端和 PyCharm 会使用同一套独立环境，下一章的脚本就能稳定运行。";
export const targets: DocTarget[] = [
  {id:"install-python",title:"准备 Python 与终端",level:2},
  {id:"project-root",title:"建立项目根目录",level:2},
  {id:"virtual-environment",title:"创建独立环境",level:2},
  {id:"install-packages",title:"安装哪些包",level:2},
  {id:"check-environment",title:"保存文件并检查",level:2},
  {id:"pycharm-interpreter",title:"让 PyCharm 对齐",level:2},
  {id:"recover-environment",title:"出错时怎样恢复",level:2},
  {id:"environment-recap",title:"确认你已理解",level:2},
];

export default function EnvironmentAndProjectRoot() {
  const check = getSourceLinks("f02-check");
  const lock = getSourceLinks("f02-lock");
  return <>
    <DocsCallout kind="info" title="前置与本章目标">
      <p>先读完 F01，知道接口以后需要一个运行中的服务端。本章先准备环境，运行现成的检查工具；普通 Python 语法在 F03 解释。</p>
      <p>主线使用 Windows、PowerShell 和 PyCharm；macOS/Linux 的等价命令放在各步骤的展开项里。本章不需要启动 API 或安装数据库。</p>
    </DocsCallout>
    <DocsSection id="install-python" title="准备 Python 与终端">
      <p><strong>Python 解释器</strong>是读取并执行 Python 程序的软件。这里使用 Python 3.12，同一小版本的补丁号可以不同。Windows 可从<a href="https://www.python.org/downloads/release/python-31210/" target="_blank" rel="noreferrer">Python 3.12.10 官方发布页</a>选择对应电脑架构的 Windows installer（常见为 64-bit）；安装时保留 Python Launcher（启动器）选项。</p>
      <p className="docs-caption">本批作者实际运行版本为 Python 3.12.4。检查工具接受 3.12 的补丁版本；3.12.10 提供 Windows 安装程序，后续仅源码的安全发布不能直接当 Windows 安装包使用。</p>
      <p><strong>终端</strong>是输入文字命令的窗口；PowerShell 是负责理解这些命令的程序。打开 Windows Terminal 或 PowerShell，先只输入下面一行，不输入行号、提示符或讲解文字。</p>
      <p><code>py</code>让 Windows 启动器选择 Python，<code>-3.12</code>指定 3.12，<code>--version</code>要求显示版本。空格分开命令和<strong>参数</strong>，参数用来告诉命令“具体怎样做”。</p>
      <LessonCode id="f02-python-version" source="f02-windows" label="PowerShell · 查看版本" start={13} end={13} />
      <p>应看到以 <code>Python 3.12.</code> 开头的版本号。如果提示找不到 <code>py</code>，先确认安装了启动器，然后关闭并重新打开终端；如果提示找不到 3.12，返回安装程序选择该版本。</p>
      <DocsAccordion title="macOS / Linux：确认 Python 3.12">
        <p>安装方式取决于操作系统，可通过官方安装包或发行版支持的包管理器安装。先确认 <code>python3.12</code> 命令存在；这里不假设裸 <code>python</code> 已指向正确版本。</p>
        <LessonCode id="f02-posix-version" source="f02-posix" label="终端 · 查看版本" start={16} end={16} />
      </DocsAccordion>
    </DocsSection>
    <DocsSection id="project-root" title="建立项目根目录">
      <p><strong>当前工作目录</strong>是终端此刻所在的文件夹，简称 CWD。相对路径会从这里寻找文件；同一条命令换一个目录运行，可能找到不同的文件。</p>
      <p>我们在你的用户目录下新建 <code>fastapi-study</code>，把它作为<strong>项目根目录</strong>，也就是这次学习所有文件的起点。</p>
      <p><code>Set-Location</code>切换目录，<code>-LiteralPath</code>按原样使用路径；<code>$env:USERPROFILE</code>读取 Windows 给当前用户保存的主目录，例如 <code>C:\Users\Lin</code>。它不是 Python 代码。</p>
      <LessonCode id="f02-parent-directory" source="f02-windows" label="PowerShell · 进入用户目录" start={6} end={6} />
      <p><code>New-Item</code>创建一个条目；<code>-ItemType Directory</code>指定文件夹，<code>-Path fastapi-study</code>指定名字。下一行进入它，<code>Get-Location</code>显示当前路径。<code>Out-Null</code>只隐藏新建目录的打印信息，不影响创建结果。</p>
      <LessonCode id="f02-create-root" source="f02-windows" label="PowerShell · 新建学习项目" start={8} end={10} />
      <p>最后的路径应以 <code>fastapi-study</code> 结尾。先预测：如果你接下来返回上一层再创建文件，文件还会落在项目根里吗？答案是否；先回到项目根，再继续。</p>
      <DocsCallout kind="note" title="已经有这个文件夹时">
        <p>先打开并查看里面的内容。可以继续使用自己的学习目录，或另起一个名字；不要删除已有文件。下面所有命令都要从你选择的项目根执行。</p>
      </DocsCallout>
      <DocsAccordion title="macOS / Linux：建立同样的目录">
        <p><code>$HOME</code>表示当前用户的主目录，<code>cd</code>切换目录，<code>--</code>结束命令选项，后面按路径处理。<code>mkdir</code>创建文件夹，<code>pwd</code>显示当前路径。先进入你的主目录，再执行建目录的三行。</p>
        <LessonCode id="f02-posix-parent" source="f02-posix" label="终端 · 进入用户目录" start={6} end={6} />
        <LessonCode id="f02-posix-root" source="f02-posix" label="终端 · 新建学习项目" start={11} end={13} />
      </DocsAccordion>
    </DocsSection>
    <DocsSection id="virtual-environment" title="创建独立环境">
      <p><strong>虚拟环境</strong>给这个项目提供一个独立的解释器入口和包安装位置。后面升级某个包时，变化会留在这个环境里，不会直接改变另一个项目的包。</p>
      <p><code>-m</code>让解释器运行一个模块；模块可以先理解为 Python 可以加载的一份程序。<code>venv</code>是 Python 自带的环境创建工具，<code>.venv</code>是我们给目标文件夹起的名字。</p>
      <LessonCode id="f02-create-venv" source="f02-windows" label="PowerShell · 在项目根创建环境" start={15} end={15} />
      <p>创建后根目录应多出 <code>.venv</code>。这里的 Python 入口是 <code>.venv\Scripts\python.exe</code>。下面的 <code>.\</code>表示“从当前目录开始找”，所以必须留在项目根。</p>
      <p><strong>pip</strong>是安装 Python 包的工具。用这个解释器运行 <code>-m pip</code>，可以明确把包安装到同一个环境；先查看它的位置。</p>
      <LessonCode id="f02-pip-location" source="f02-windows" label="PowerShell · 检查 pip 位置" start={19} end={19} />
      <p>输出中的路径应位于这个项目的 <code>.venv</code> 内。我们始终写完整的环境入口，不需要先执行激活脚本，也不需要修改 PowerShell 执行策略。</p>
      <DocsAccordion title="macOS / Linux：环境入口不同">
        <p>环境创建命令仍使用 <code>-m venv</code>，解释器入口位于 <code>.venv/bin/python</code>。</p>
        <LessonCode id="f02-posix-venv" source="f02-posix" label="终端 · 创建环境" start={17} end={17} />
        <LessonCode id="f02-posix-pip" source="f02-posix" label="终端 · 查看 pip" start={20} end={20} />
      </DocsAccordion>
    </DocsSection>
    <DocsSection id="install-packages" title="安装哪些包">
      <p><strong>包</strong>是别人写好、可安装和导入的 Python 工具。本章提前准备两个工具：FastAPI 用来创建 API 应用，Uvicorn 用来运行它们。具体调用会在后面的章节逐项解释。</p>
      <div className="docs-table-wrap"><table><thead><tr><th>包</th><th>本批版本</th><th>怎样使用</th></tr></thead><tbody>
        <tr><td>FastAPI</td><td><code>0.162.0</code></td><td>后续从 <code>fastapi</code> 导入应用类</td></tr>
        <tr><td>Uvicorn</td><td><code>0.54.0</code></td><td>后续通过环境解释器启动服务器</td></tr>
        <tr><td>Pydantic</td><td><code>2.14.1</code></td><td>FastAPI 的依赖；后续解释数据验证</td></tr>
      </tbody></table></div>
      <p>包清单采用标准小写安装名 <code>fastapi</code>；pip 会规范化发行包名的大小写。Python 代码中的模块和类名则要按源码精确拼写：模块 <code>fastapi</code>，类 <code>FastAPI</code>。本章的检查工具还使用标准库 <code>pathlib</code> 和 <code>sys</code>；它们随 Python 提供，不需要用 pip 安装。</p>
      <LessonCode id="f02-direct-requirements" source="f02-requirements" label="requirements.txt · 直接依赖" />
      <p><code>==</code>在这个文本文件中表示固定版本。FastAPI 还会安装它依赖的工具，因此完整环境需要更多包。请打开<a href={lock.file} target="_blank" rel="noreferrer">本章 requirements.lock.txt ↗</a>，在 GitHub 点击 Raw，把完整文本保存到项目根，文件名保持原样。</p>
      <p><code>install</code>是 pip 的安装动作，<code>-r</code>表示从指定文件读取包清单。先确认文件确实位于项目根，再执行：</p>
      <LessonCode id="f02-install-lock" source="f02-windows" label="PowerShell · 安装本批依赖" start={23} end={23} />
      <p>如果连接失败，修复网络后重试同一条命令。成功后会显示安装结果或已满足依赖；包不是安装到教程网站里，而是安装到你本地的环境里。</p>
      <DocsAccordion title="macOS / Linux：安装清单">
        <LessonCode id="f02-posix-install" source="f02-posix" label="终端 · 安装本批依赖" start={23} end={23} />
      </DocsAccordion>
    </DocsSection>
    <DocsSection id="check-environment" title="保存文件并检查">
      <p>打开<a href={check.file} target="_blank" rel="noreferrer">check_environment.py 固定源码 ↗</a>，通过 Raw 保存完整文件到项目根。<code>.py</code>是 Python 文件的扩展名；Windows 资源管理器开启“查看 → 显示 → 文件扩展名”，确认没有变成 <code>check_environment.py.txt</code>。</p>
      <p>此时根目录应有 <code>.venv</code>、<code>requirements.lock.txt</code> 和 <code>check_environment.py</code>。保存（<kbd>Ctrl + S</kbd>）后，使用环境解释器运行这个现成检查工具：</p>
      <LessonCode id="f02-run-check" source="f02-windows" label="PowerShell · 检查目录、环境和导入" start={27} end={27} />
      <p>程序会打印当前目录、实际 Python 入口和三个包的版本。路径因机器而异，最后应看到 <code>OK: project directory, interpreter and imports agree</code>。只有显示这行，才继续下一章。</p>
      <p>检查工具导入了 <code>fastapi</code>、<code>uvicorn</code> 和 <code>pydantic</code>来确认它们能被当前解释器找到。它会在目录、环境或导入不一致时退出；退出不等于启动或停止一个 API。</p>
      <DocsAccordion title="查看完整检查工具：供恢复核对">
        <p>当前按完整文件使用，不要求修改它。下一章先学习普通脚本需要的语法，检查工具里的路径与异常处理会在后续需要时解释。</p>
        <LessonCode id="f02-complete-check" source="f02-check" label="check_environment.py · 完整恢复文件" />
      </DocsAccordion>
      <DocsAccordion title="macOS / Linux：运行检查工具">
        <LessonCode id="f02-posix-check" source="f02-posix" label="终端 · 检查环境" start={24} end={24} />
      </DocsAccordion>
    </DocsSection>
    <DocsSection id="pycharm-interpreter" title="让 PyCharm 对齐">
      <p>终端所在目录和使用哪个解释器，是两个独立的设置。PyCharm 也有自己的设置；编辑器能打开文件，不代表它运行时已经用了项目环境。</p>
      <LessonDiagram kind="environment" />
      <ol>
        <li>在 PyCharm 中选择 Open，打开刚刚建立的 <code>fastapi-study</code> 文件夹。</li>
        <li>在 Settings → Project → Python Interpreter 中选择已有的本地解释器：项目内 <code>.venv\Scripts\python.exe</code>；macOS/Linux 使用 <code>.venv/bin/python</code>。</li>
        <li>打开 <code>check_environment.py</code>，建立 Python 运行配置。Script path 指向这个文件，Working directory 指向项目根，Interpreter 选择刚才的项目解释器。</li>
        <li>运行配置。比较 PyCharm 和终端打印的 <code>Python executable</code>，两者应指向同一个入口，并都打印最后的 OK。</li>
      </ol>
      <p>菜单名称可能随 PyCharm 版本稍有差异，核对路径比记住按钮位置更可靠。PyCharm 内置终端也要使用本章完整环境命令，不能只根据提示符上的环境名判断。</p>
    </DocsSection>
    <DocsSection id="recover-environment" title="出错时怎样恢复">
      <p>先判断错误发生在找文件、选解释器还是导入包，再改对应设置。不要一遇到问题就重新安装所有工具。</p>
      <div className="docs-table-wrap"><table><thead><tr><th>观察</th><th>原因与恢复</th></tr></thead><tbody>
        <tr><td><code>can't open file</code></td><td>命令找不到脚本。核对当前目录、扩展名和保存位置，再从项目根重试。</td></tr>
        <tr><td><code>wrong working directory</code></td><td>脚本已找到，但 CWD 与项目根不同。切回根目录；PyCharm 修改 Working directory 后重跑。</td></tr>
        <tr><td><code>wrong interpreter</code></td><td>选到了系统 Python 或另一个环境。改用本项目的环境入口，重跑检查。</td></tr>
        <tr><td><code>missing package</code></td><td>当前环境缺依赖。使用同一个环境解释器重新安装本章 lock 文件，再重跑检查。</td></tr>
        <tr><td><code>package versions differ</code></td><td>依赖已安装，但版本与本章不符。用同一个环境解释器重装本章 lock 文件，再重跑检查。</td></tr>
        <tr><td><code>use Python 3.12</code></td><td>先确认 3.12 已安装，再在一个新的学习目录创建环境；已有环境内容先保留。</td></tr>
      </tbody></table></div>
      <p>做一次可逆的排错练习：只在 PyCharm 运行配置中把 Working directory 临时改为项目的父目录，保留脚本绝对路径和原解释器。应出现 <code>wrong working directory</code>。把目录改回项目根并重跑，确认恢复到 OK。</p>
      <p>再看一眼安装命令：它为什么使用 <code>python.exe -m pip</code>？因为“安装依赖的解释器”和“运行脚本的解释器”必须一致。</p>
    </DocsSection>
    <DocsSection id="environment-recap" title="确认你已理解">
      <ul><li>能指出自己的项目根，并解释相对路径从哪里开始找。</li><li>能找到本项目的环境解释器，知道包安装到哪个环境。</li><li>终端和 PyCharm 都能运行检查工具，显示相同解释器和 OK。</li><li>能恢复一次错工作目录，而不是依靠重装解决。</li></ul>
      <p>下一章会在这个环境里运行几份短 Python 文件，解释赋值、函数、导入和类型提示。先保留本章环境与检查工具。</p>
    </DocsSection>
  </>;
}
