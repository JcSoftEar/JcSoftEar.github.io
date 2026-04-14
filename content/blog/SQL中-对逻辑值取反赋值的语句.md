---
title: "SQL中 对逻辑值取反赋值的语句"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# SQL中 对逻辑值取反赋值的语句

> 原文链接: https://www.cnblogs.com/inday/archive/2009/01/14/1375328.html | 迁移自博客园

---

1 在access数据库中

UPDATE ywx_subject SET iscurrent =iif(iscurrent,0,1);

这个语句是将数据库中的iscurrent逻辑字段取反 true改为false,false改为true

2 在sql server中 bit类型的字段取反

UPDATE ywx_subject SET iscurrent =iscurrent^1;

