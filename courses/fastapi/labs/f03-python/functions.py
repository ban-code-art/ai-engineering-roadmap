# 赋值让 greeting 保存问候前缀，函数稍后会读取它。
greeting = "Hello"


def greet(name: str) -> str:
    # return 把结果交还调用者；它不会自动显示在终端。
    return greeting + ", " + name


message = greet("Lin")
print(message)
