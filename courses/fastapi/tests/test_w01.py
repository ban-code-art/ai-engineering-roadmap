"""作者行为验证；不是 F01–F03 学习者需要先掌握的测试教程。"""

import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


LABS = Path(__file__).resolve().parents[1] / "labs"


def run_python(path: Path, *, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(path)], cwd=cwd or path.parent,
        env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        capture_output=True, text=True, encoding="utf-8", timeout=15,
    )


class PythonLessons(unittest.TestCase):
    def test_functions_can_change_one_input_and_restore(self) -> None:
        source = LABS / "f03-python" / "functions.py"
        original = source.read_text(encoding="utf-8")
        self.assertEqual(run_python(source).stdout.splitlines(), ["Hello, Lin"])
        with tempfile.TemporaryDirectory() as directory:
            changed = Path(directory) / "functions.py"
            changed.write_text(original.replace('greet("Lin")', 'greet("Mei")'), encoding="utf-8")
            self.assertEqual(run_python(changed).stdout.splitlines(), ["Hello, Mei"])
            changed.write_text(original, encoding="utf-8")
            self.assertEqual(run_python(changed).stdout.splitlines(), ["Hello, Lin"])

    def test_collections_preserve_value_types(self) -> None:
        result = run_python(LABS / "f03-python" / "containers.py")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines(), ["Read the docs", "False", "2"])

    def test_import_loads_module_before_explicit_call(self) -> None:
        result = run_python(LABS / "f03-python" / "imports.py")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines(), [
            "imports: before import", "messages: loaded", "imports: after import", "Hello, Lin",
        ])

    def test_dictionary_typo_has_specific_error_and_recovers(self) -> None:
        original = (LABS / "f03-python" / "containers.py").read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as directory:
            changed = Path(directory) / "containers.py"
            changed.write_text(original.replace('task["title"]', 'task["titel"]'), encoding="utf-8")
            result = run_python(changed)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("KeyError: 'titel'", result.stderr)
            changed.write_text(original, encoding="utf-8")
            self.assertEqual(run_python(changed).returncode, 0)

    def test_missing_sibling_module_has_specific_error_and_recovers(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            source = LABS / "f03-python"
            (target / "imports.py").write_bytes((source / "imports.py").read_bytes())
            result = run_python(target / "imports.py")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("ModuleNotFoundError: No module named 'messages'", result.stderr)
            (target / "messages.py").write_bytes((source / "messages.py").read_bytes())
            self.assertEqual(run_python(target / "imports.py").returncode, 0)

    def test_type_hints_do_not_validate_direct_calls(self) -> None:
        result = run_python(LABS / "f03-python" / "annotations.py")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines(), ["3", "three"])

    def test_registration_does_not_invoke_function(self) -> None:
        result = run_python(LABS / "f03-python" / "decorators.py")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines(), ["registered: hello", "calling now", "Hello, Lin"])

    def test_syntax_error_is_visible_and_source_can_be_restored(self) -> None:
        original = (LABS / "f03-python" / "functions.py").read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as directory:
            changed = Path(directory) / "functions.py"
            changed.write_text(original.replace("    return", "return"), encoding="utf-8")
            result = run_python(changed)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("IndentationError", result.stderr)
            changed.write_text(original, encoding="utf-8")
            self.assertEqual(run_python(changed).returncode, 0)

    def test_wrong_working_directory_is_explained(self) -> None:
        source = LABS / "f02-environment" / "check_environment.py"
        with tempfile.TemporaryDirectory() as directory:
            result = run_python(source, cwd=Path(directory))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("ERROR: wrong working directory", result.stderr)


if __name__ == "__main__":
    unittest.main()
