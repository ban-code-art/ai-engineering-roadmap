print("imports: before import")

# messages.py 放在本文件旁边；导入得到函数名称，不是调用函数。
from messages import make_message

print("imports: after import")
print(make_message("Lin"))
