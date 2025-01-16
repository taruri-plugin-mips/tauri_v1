#!/bin/bash

if [ $# -eq 0 ]; then
    echo "请提供 deb 文件路径"
    exit 1
fi

DEB_FILE=$1

# 检查文件是否存在
if [ ! -f "$DEB_FILE" ]; then
    echo "错误: deb 文件不存在"
    exit 1
fi

# 安装 deb 文件
echo "正在安装: $(basename "$DEB_FILE")"
pkexec apt install -y --reinstall "$DEB_FILE"

if [ $? -eq 0 ]; then
    echo "安装完成!"
else
    echo "安装失败!"
    exit 1
fi
