def echo(value: int) -> int:
    # 类型提示描述预期；普通 Python 调用不会自动按注解检查 value。
    return value


print(echo(3))
print(echo("three"))  # 故意违背提示，观察它仍然返回字符串。
