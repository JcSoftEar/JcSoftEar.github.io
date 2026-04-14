---
title: "开源作品 | cnblogs-to-hugo 博客园文章迁移工具"
date: 2026-04-14
description: "批量将博客园文章迁移到 Hugo 静态博客的 GUI 工具"
categories: ["开源作品"]
tags: ["Python", "Hugo", "博客园", "工具", "GUI"]
---

# 开源作品 | cnblogs-to-hugo 博客园文章迁移工具

今天分享一个最近写的工具 —— **cnblogs-to-hugo**，用于将博客园文章批量迁移到 Hugo 静态博客。

## 背景

之前博客一直挂在博客园，但博客园界面老旧、加载慢，决定迁移到 Hugo。但手动一篇篇迁移太费时，于是写了这个工具。

## 功能特性

- **GUI 界面** - 简洁易用的图形化界面
- **批量获取** - 自动获取博客园用户的所有文章列表
- **分页支持** - 自动翻页获取完整文章列表
- **选择性下载** - 支持全选、反选文章
- **格式转换** - 将 HTML 内容转换为 Markdown 格式
- **图片链接处理** - 自动修复图片链接
- **Hugo 兼容** - 生成符合 Hugo 规范的 Markdown 文件，包含完整的 Front Matter

## 技术栈

- **GUI**: tkinter
- **网络请求**: requests
- **HTML 解析**: BeautifulSoup
- **格式转换**: html2text

## 使用方法

1. 运行脚本：
```bash
python cnblogs_to_hugo.py
```

2. 在界面中输入博客园用户名
3. 设置输出目录（默认为 `./hugo_content`）
4. 点击「获取文章列表」按钮
5. 在列表中勾选需要迁移的文章
6. 点击「下载选中文章」开始转换

## 输出格式

生成的文件为 Hugo Markdown 格式：

```markdown
---
title: "文章标题"
date: 2024-01-01
categories: ["博客园迁移"]
draft: false
---

# 文章标题

> 原文链接: https://www.cnblogs.com/xxx/p/xxx | 迁移自博客园

---

文章内容...
```

## 项目地址

🧩 <https://github.com/JcSoftEar/cnblogs-to-hugo>

---

有需要迁移博客园文章的同学可以试试，有问题欢迎提 Issue。
