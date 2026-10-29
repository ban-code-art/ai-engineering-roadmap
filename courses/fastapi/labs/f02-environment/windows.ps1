# 完整作者/恢复流程。逐步跟做时按教程分段执行，不必运行此脚本。
$ErrorActionPreference = 'Stop'
$labDirectory = $PSScriptRoot

# 从明确父目录开始；已存在的学习项目不会被覆盖。
Set-Location -LiteralPath $env:USERPROFILE
if (Test-Path -LiteralPath 'fastapi-study') { throw 'fastapi-study already exists; use the lesson recovery steps.' }
New-Item -ItemType Directory -Path fastapi-study | Out-Null
Set-Location -LiteralPath fastapi-study
Get-Location

# py 是 Windows 的 Python 启动器；-3.12 指定版本，-m 运行标准库模块。
py -3.12 --version
if ($LASTEXITCODE -ne 0) { throw 'Install Python 3.12 with the Python launcher first.' }
py -3.12 -m venv .venv
if ($LASTEXITCODE -ne 0) { throw 'Virtual environment creation failed.' }

# 用这个解释器安装，避免裸 pip 指向另一个 Python。
.\.venv\Scripts\python.exe -m pip --version
if ($LASTEXITCODE -ne 0) { throw 'pip is unavailable in this environment.' }
Copy-Item -LiteralPath (Join-Path $labDirectory 'requirements.lock.txt') -Destination .
Copy-Item -LiteralPath (Join-Path $labDirectory 'check_environment.py') -Destination .
.\.venv\Scripts\python.exe -m pip install -r requirements.lock.txt
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed; retry the same command after fixing the connection.' }

# 这里只运行检查工具，不启动 API 服务。
.\.venv\Scripts\python.exe check_environment.py
if ($LASTEXITCODE -ne 0) { throw 'Environment check failed; follow its diagnostic.' }
