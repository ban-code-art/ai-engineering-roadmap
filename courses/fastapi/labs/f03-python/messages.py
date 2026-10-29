# 首次导入会执行模块顶层；定义函数此时还不会执行函数体。
print("messages: loaded")


def make_message(name: str) -> str:
    return "Hello, " + name
