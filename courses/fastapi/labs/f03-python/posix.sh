#!/usr/bin/env bash
# 从 fastapi-study 根运行；先按正文保存对应 .py 文件。
set -euo pipefail
mkdir -p python-basics

./.venv/bin/python python-basics/functions.py
./.venv/bin/python python-basics/containers.py
./.venv/bin/python python-basics/imports.py
./.venv/bin/python python-basics/annotations.py

# 选读：未选择此实验时不必执行此行。
./.venv/bin/python python-basics/decorators.py
