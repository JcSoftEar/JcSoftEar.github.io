---
title: "32bitwin7硬盘安装win8-64bit"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 32bitwin7硬盘安装win8-64bit

> 原文链接: https://www.cnblogs.com/inday/archive/2012/06/22/2558770.html | 迁移自博客园

---

32bitwin7硬盘安装win8-64bit 1、硬件支持64bit是最基本的，可以用cpu-z查看。 2、下载win7-32bit和win8-64bit，虚拟或提取到非c盘下，如果格式化c盘装win8-64bit，建议提取的好。 3、在cmd下用32位里的setup加一个installfrom参数,指向64位的sources目录的install.wim。 例如：d:\win7-32\setup.exe /installfrom:d\win8-64\sources\install.wim 

