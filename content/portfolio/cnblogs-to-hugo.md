---
title: "cnblogs-to-hugo"
date: 2026-04-14
description: "博客园文章批量迁移到 Hugo 静态博客的 GUI 工具"
type: "portfolio"
filter: "component"
category: "工具软件"
tech: "Python · tkinter · BeautifulSoup"
tags: ["Python", "Hugo", "博客园", "GUI", "工具"]
github: "https://github.com/JcSoftEar/cnblogs-to-hugo"
image: "images/cnblogs-to-hugo.jpg"
---

# cnblogs-to-hugo

![cnblogs-to-hugo 界面截图](../images/cnblogs-to-hugo.jpg)

博客园文章批量迁移到 Hugo 静态博客的 GUI 工具。

## 功能特性

- **GUI 界面** - 简洁易用的图形化界面
- **批量获取** - 自动获取博客园用户的所有文章列表
- **分页支持** - 自动翻页获取完整文章列表
- **选择性下载** - 支持全选、反选文章
- **格式转换** - 将 HTML 内容转换为 Markdown 格式
- **图片链接处理** - 自动修复图片链接
- **Hugo 兼容** - 生成符合 Hugo 规范的 Markdown 文件

## 技术栈

Python + tkinter + requests + BeautifulSoup + html2text

## 使用方法

```bash
python cnblogs_to_hugo.py
```

输入博客园用户名 → 选择文章 → 一键迁移到 Hugo 格式。

## 项目地址

🧩 <https://github.com/JcSoftEar/cnblogs-to-hugo>
