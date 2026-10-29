#!/usr/bin/env bash
# macOS/Linux 完整恢复流程；教程仍按下面的小块逐步执行。
set -euo pipefail
lab_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

cd -- "$HOME"
if [[ -e fastapi-study ]]; then
  printf '%s\n' 'fastapi-study already exists; use the lesson recovery steps.' >&2
  exit 1
fi
mkdir fastapi-study
cd fastapi-study
pwd

# 使用已安装的 Python 3.12；命令名在 macOS/Linux 上是 python3.12。
python3.12 --version
python3.12 -m venv .venv

# 不依赖激活状态；直接使用项目环境中的解释器。
./.venv/bin/python -m pip --version
cp -- "$lab_directory/requirements.lock.txt" .
cp -- "$lab_directory/check_environment.py" .
./.venv/bin/python -m pip install -r requirements.lock.txt
./.venv/bin/python check_environment.py
