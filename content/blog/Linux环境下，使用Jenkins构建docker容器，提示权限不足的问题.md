---
title: "Linux环境下，使用Jenkins构建docker容器，提示权限不足的问题"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Linux环境下，使用Jenkins构建docker容器，提示权限不足的问题

> 原文链接: https://www.cnblogs.com/inday/p/17894328.html | 迁移自博客园

---

sudo chown jenkins:jenkins /var/run/docker.sock  
sudo chown docker:docker /var/run/docker.sock  
sudo usermod -aG docker jenkins

