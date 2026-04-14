---
title: "System.Runtime.InteropServices.COMException: 拒绝访问."
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# System.Runtime.InteropServices.COMException: 拒绝访问.

> 原文链接: https://www.cnblogs.com/inday/archive/2005/08/21/219796.html | 迁移自博客园

---

最近在做IIS管理软件的时候，在连接ADIL的时候老是出错，研究了半天没找出原因。  
因为先前一直用web来测试，一直没注意到权限问题，今天在msdn上刚刚找到原因，原来是IIS操作权限的问题，问题找到了，也好解决了。  
打开web.config  
然后在system.web节点中添加一属性 <identity impersonate="true" />  
OK  
  
具体用法查看ms-help://MS.VSCC.2003/MS.MSDNQTR.2003FEB.2052/cpgenref/html/gngrfIdentitySection.htm

