#!/bin/bash  必须在 linux 环境

# 获取脚本所在目录
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "📂 当前脚本目录: $SCRIPT_DIR"

# 检查 package.json 是否存在
if [[ -f "$SCRIPT_DIR/package.json" ]]; then
    echo "📦 发现 package.json，执行 npm install..."
    cd "$SCRIPT_DIR" || exit
    npm install
    echo "✅ npm install 执行完成！"
else
    echo "❌ 未找到 package.json，无法安装依赖。"
fi
