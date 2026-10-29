from collections.abc import Callable


def register(function: Callable[[str], str]) -> Callable[[str], str]:
    # 这里只报告登记动作，再把函数本身交还；没有调用函数体。
    print("registered: " + function.__name__)
    return function


@register
def hello(name: str) -> str:
    return "Hello, " + name


print("calling now")
print(hello("Lin"))
