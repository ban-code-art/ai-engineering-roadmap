"""保存到 fastapi-study 项目根，并从该目录运行这个检查工具。"""

from pathlib import Path
import sys


project_root = Path(__file__).resolve().parent
print(f"Working directory: {Path.cwd()}")
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version.split()[0]}")

# 文件所在目录和命令所在目录必须一致，否则后续相对路径会指错位置。
if Path.cwd().resolve() != project_root:
    sys.exit(f"ERROR: wrong working directory; open terminal in {project_root}")

if sys.version_info[:2] != (3, 12):
    sys.exit("ERROR: use Python 3.12 for this course batch")

# 显式检查环境位置；选错另一个虚拟环境也不会误报成功。
if Path(sys.prefix).resolve() != (project_root / ".venv").resolve():
    sys.exit("ERROR: wrong interpreter; use this project's .venv Python")

try:
    import fastapi
    import uvicorn
    import pydantic
except ImportError as error:
    sys.exit(f"ERROR: missing package; install requirements.lock.txt with this interpreter: {error}")

if (fastapi.__version__, uvicorn.__version__, pydantic.__version__) != ("0.162.0", "0.54.0", "2.14.1"):
    sys.exit("ERROR: package versions differ; reinstall requirements.lock.txt with this interpreter")

print(f"FastAPI: {fastapi.__version__}")
print(f"Uvicorn: {uvicorn.__version__}")
print(f"Pydantic: {pydantic.__version__}")
print("OK: project directory, interpreter and imports agree")
