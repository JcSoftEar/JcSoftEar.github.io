---
title: "Chrome  扩展插件开发"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Chrome  扩展插件开发

> 原文链接: https://www.cnblogs.com/inday/archive/2013/05/02/chrome-plus-first.html | 迁移自博客园

---

闲来没事，试着玩下chrome 扩展插件开发，先记录下关键的东西吧。

1、创建一个开发目录

2、按照chrome扩展协定，创建：`manifest.json`文件，文件必须UTF8编码，文件中定义了些扩展的信息，属性和描述等。

3、目前强制“manifest_version”属性为2，1已经过时。

在chrome中，输入：chrome://extensions 进入扩展中心，或者工具-扩展中心

测试需要确保为“开发模式”，点击“载入正在开发中的扩展”，选择开发目录，确定。

目前只是做个小插件，能够根据淘宝用户名查询到用户签证状态即可

