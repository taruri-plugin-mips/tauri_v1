#!/bin/bash

# 下载文件的函数
download_file() {
    local download_url="$1"
    local filename=$(basename "$download_url")
    
    echo "开始下载: $filename"
    if curl -L --progress-bar "$download_url" -o "$filename"; then
        echo "下载完成: $filename"
        return 0
    else
        echo "下载失败"
        return 1
    fi
}

# 更新计数的函数
update_count() {
    local count_file="count.json"
    
    if [ ! -f "$count_file" ]; then
        echo '{"count": 1}' > "$count_file"
        echo "创建新的下载计数文件"
    else
        local current_count=$(jq '.count' "$count_file")
        local new_count=$((current_count + 1))
        echo "{\"count\": $new_count}" > "$count_file"
        echo "更新下载计数: $new_count"
    fi
}

# 主程序
if [ $# -eq 0 ]; then
    echo "请提供下载URL"
    echo "使用方法: $0 <URL>"
    exit 1
fi

# 执行下载
if download_file "$1"; then
    update_count
else
    exit 1
fi
