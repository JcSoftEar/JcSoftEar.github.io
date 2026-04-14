---
title: "让你的IE支持Wap网页"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 让你的IE支持Wap网页

> 原文链接: https://www.cnblogs.com/inday/archive/2008/10/10/1307728.html | 迁移自博客园

---

最近一直在做Wap网站的东西，了解了点wml，不过做完后，测试就是件麻烦的事了，目前是用Opera来进行测试的，虽然说不错，但还是感觉没IE亲切

看了一下，应该是MiMe的问题，没有注册进来，随后google了一下，找到方法，自己贴出来，以后用起来找起来也方便。

把以下代码存为.reg文件，然后保存后合并即可

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Code  
Windows Registry Editor Version 5.00  
[HKEY_CURRENT_USER\Software\Classes\MIME\Database\Content Type\text/vnd.wap.wml]  
"CLSID"="{25336920-03F9-11cf-8FD0-00AA00686F13}"

