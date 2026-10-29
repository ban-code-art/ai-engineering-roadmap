# 从 F02 建立的 fastapi-study 项目根逐步执行；先按正文保存对应 .py 文件。
$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Path python-basics -Force | Out-Null

.\.venv\Scripts\python.exe python-basics\functions.py
if ($LASTEXITCODE -ne 0) { throw 'functions.py failed; check the saved file and indentation.' }

.\.venv\Scripts\python.exe python-basics\containers.py
if ($LASTEXITCODE -ne 0) { throw 'containers.py failed; check brackets, quotes and file path.' }

.\.venv\Scripts\python.exe python-basics\imports.py
if ($LASTEXITCODE -ne 0) { throw 'imports.py failed; keep messages.py beside imports.py.' }

.\.venv\Scripts\python.exe python-basics\annotations.py
if ($LASTEXITCODE -ne 0) { throw 'annotations.py failed; restore the source file.' }

# 选读：未选择此实验时到上一步即可停止。
.\.venv\Scripts\python.exe python-basics\decorators.py
if ($LASTEXITCODE -ne 0) { throw 'decorators.py failed; restore the source file.' }
