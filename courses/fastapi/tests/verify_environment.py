"""在临时用户目录完整执行 Windows 跟做流程，并保存作者运行证据。"""

from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile


course = Path(__file__).resolve().parents[1]
repository = course.parents[1]
lab = course / "labs" / "f02-environment"
evidence_path = repository / "docs" / "evidence" / "verification" / "fastapi-w01-labs.json"
powershell = shutil.which("pwsh") or shutil.which("powershell")
if powershell is None:
    sys.exit("Windows PowerShell is required for this author verification.")


def execute(command: list[str], cwd: Path, env: dict[str, str]) -> dict[str, object]:
    result = subprocess.run(
        command, cwd=cwd, env=env, capture_output=True, text=True,
        encoding="utf-8", errors="replace", timeout=180,
    )
    return {"command": command, "cwd": str(cwd), "exit_code": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr}


with tempfile.TemporaryDirectory(prefix="fastapi-w01-") as temporary:
    parent = Path(temporary)
    # 只改变子进程的 USERPROFILE；不改系统设置，也不触碰真实学习目录。
    child_env = {**os.environ, "USERPROFILE": str(parent), "PYTHONIOENCODING": "utf-8"}
    setup = execute([powershell, "-NoProfile", "-File", str(lab / "windows.ps1")], lab, child_env)
    project = parent / "fastapi-study"
    python = project / ".venv" / "Scripts" / "python.exe"
    results = [setup]
    if setup["exit_code"] == 0:
        results.append(execute([str(python), "-m", "pip", "check"], project, child_env))
        results.append(execute([str(python), str(project / "check_environment.py")], parent, child_env))
        results.append(execute([sys.executable, "check_environment.py"], project, child_env))
        results.append(execute([str(python), "check_environment.py"], project, child_env))
        basics = project / "python-basics"
        basics.mkdir()
        for source in (course / "labs" / "f03-python").glob("*.py"):
            shutil.copy2(source, basics / source.name)
        results.append(execute([powershell, "-NoProfile", "-File", str(course / "labs" / "f03-python" / "windows.ps1")], project, child_env))
        results.append(execute([str(python), "-m", "unittest", "discover", "-s", str(course / "tests"), "-v"], project, child_env))
    evidence = {
        "batch": "W01", "chapters": ["F01", "F02", "F03"],
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "author_python": sys.version.split()[0], "os": sys.platform,
        "results": results,
        "gaps": ["No real beginner/PyCharm follow-along participant.",
                 "macOS/Linux shell has syntax verification only; no full POSIX package installation run.",
                 "F01 HTTP messages are labeled teaching illustrations; no HTTP service runs in W01."],
    }
    evidence_path.parent.mkdir(parents=True, exist_ok=True)
    evidence_path.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"evidence": str(evidence_path), "setup_exit": setup["exit_code"],
                      "result_exit_codes": [item["exit_code"] for item in results]}, ensure_ascii=False))
    if [item["exit_code"] for item in results] != [0, 0, 1, 1, 0, 0, 0]:
        sys.exit(1)
