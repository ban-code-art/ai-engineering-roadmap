# FastAPI 教程配套源码

当前只发布 W01（F01–F03）。本目录没有 FastAPI API 应用；首个应用从 F04 开始逐步建立。

| 章节 | 文件 | 使用方式 |
| --- | --- | --- |
| F01 请求与响应 | `labs/f01-http/requests.http`、`responses.http` | 只读 HTTP 教学示意；没有服务器，不发送这些请求 |
| F02 环境与项目根 | `labs/f02-environment/` | Python 3.12 + 独立 `.venv`，从项目根运行检查工具 |
| F03 必要 Python | `labs/f03-python/` | 保存短文件到 F02 项目根的 `python-basics/` 后逐个执行 |

## F02 的文件和依赖

Python 是运行 `.py` 文件的解释器，`venv` 是 Python 自带的环境工具，`pip` 负责将第三方包装到选定环境。FastAPI 与 Uvicorn 是本批直接安装的包；Pydantic 等传递依赖由 FastAPI 引入，完整版本见 `requirements.lock.txt`。本批不安装数据库或外部 HTTP 客户端。

作者目标 Python 3.12；当前验证补丁为 3.12.4。框架组合为 FastAPI 0.162.0、Uvicorn 0.54.0、Pydantic 2.14.1。后续批次修改依赖会有独立源码检查点。

从教程提供的固定版本链接取得 `check_environment.py` 与 `requirements.lock.txt`，按正文建立用户目录下的 `fastapi-study`，将这两个文件保存到该项目根。**日常主线是逐步执行正文命令**。完整 `windows.ps1` / `posix.sh` 供作者复现与恢复参考：须先取得同目录的配套文件，且只会创建尚不存在的 `fastapi-study`，不会覆盖已有学习项目。

Windows 不需要激活虚拟环境：在 `fastapi-study` 根用 `.\.venv\Scripts\python.exe -m pip install -r requirements.lock.txt` 安装，再用 `.\.venv\Scripts\python.exe check_environment.py` 检查。macOS/Linux 对应解释器是 `./.venv/bin/python`。

`check_environment.py` 是现成检查工具。它检查当前目录、Python 大版本、项目 `.venv` 位置、真正的模块导入及三个上层包版本。成功最后一行为 `OK: project directory, interpreter and imports agree`。

| 失败信息 | 恢复动作 |
| --- | --- |
| `wrong working directory` | 将终端切回 `fastapi-study` 根，重新执行同一命令 |
| `wrong interpreter` | 终端改用项目 `.venv` 的完整路径；PyCharm 选择同一解释器 |
| `missing package` / `package versions differ` | 用这个 `.venv` 解释器执行同一条 `pip install -r requirements.lock.txt` |

## F03 每次只运行一个短例子

所有 Python 源文件保存到 `fastapi-study/python-basics/`。`messages.py` 必须与 `imports.py` 并排，`imports.py` 才能找到该模块。

| 文件 | 稳定输出/观察 |
| --- | --- |
| `functions.py` | `Hello, Lin`；只将调用参数改成 `Mei` 后为 `Hello, Mei` |
| `containers.py` | 依次显示 `Read the docs`、`False`、`2`；故意访问不存在的键会得到 `KeyError` |
| `imports.py` + `messages.py` | `imports: before import` → `messages: loaded` → `imports: after import` → `Hello, Lin` |
| `annotations.py` | `3`、`three`；普通调用不会按注解自动校验参数 |
| `decorators.py`（选读） | 先 `registered: hello`，再 `calling now`，最后 `Hello, Lin`；登记动作与函数体执行分开 |

`containers.py` 特意避开 `collections.py` 这个名称，以免同目录文件遮蔽 Python 标准库 `collections`。`decorators.py` 的 `Callable` 来自标准库 `collections.abc`，无需额外安装；它只描述“可调用的函数”，不引入 FastAPI 的应用对象。

## 作者验证

普通例子与可恢复错误：`py -3.12 -m unittest discover -s courses/fastapi/tests -v`。完整 Windows 新环境验证：`py -3.12 courses/fastapi/tests/verify_environment.py`，只改变子进程的 `USERPROFILE` 并在临时目录创建项目，不修改真实用户环境。结果记录在 `docs/evidence/verification/fastapi-w01-labs.json`。

作者运行、浏览器展示和初学者/PyCharm 跟做是不同证据。没有真实初学者反馈前不声称教学已被学习者验证。
