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

# 创建临时目录
TEMP_DIR=$(mktemp -d)
echo "使用临时目录: $TEMP_DIR"

# 解压 deb 文件
echo "正在解压 deb 文件..."
dpkg-deb -x "$DEB_FILE" "$TEMP_DIR"

if [ $? -ne 0 ]; then
    echo "解压失败"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# 检查是否存在 usr 目录
if [ ! -d "$TEMP_DIR/usr" ]; then
    echo "错误: 未找到 usr 目录"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# 更新 usr 目录
echo "正在更新 usr 目录..."
pkexec cp -rf "$TEMP_DIR/usr" /

if [ $? -ne 0 ]; then
    echo "更新失败"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# 清理临时文件
echo "清理临时文件..."
rm -rf "$TEMP_DIR"

echo "更新完成!"
