---
title: "Python中字典的常用方法"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Python中字典的常用方法

> 原文链接: https://www.cnblogs.com/inday/p/python-dict-function.html | 迁移自博客园

---

### Python中的字典

Python中的字典是另一种可变容器模型，且可存储任意类型对象。键值使用冒号分割，你可以看成是一串json。

### 常用方法

#### 获取字典中的值

dict[key] 如果key不存在会报错，建议使用dict.get(key)，不存在返回None

#### 修改和新建字典值

dict[key]=value

#### 删除字典中的值

del dict[key] ：删除某一项  
dict.clear() ： 清空所有  
del dict : 删除字典 删除后都不允许访问

#### 循环访问
    
    
    for key in dict:
        item = dict[key]
    

#### 判断键是否存在
    
    
    if key in dict:
        // 存在
    else:
        // 不存在
    

#### 特性

  * 键不允许重复，遇到重复的，后一个会把前一个覆盖
  * 键只能用数字，字符串或元组充当



