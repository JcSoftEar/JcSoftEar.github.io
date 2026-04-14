---
title: "用Js控制TextBox不能复制粘贴"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 用Js控制TextBox不能复制粘贴

> 原文链接: https://www.cnblogs.com/inday/archive/2007/12/21/1009301.html | 迁移自博客园

---

今天项目中，有一个要求，需要有一个Textbox（WebControls），不能复制、粘贴  
  
一开始没想到TextBox有这个事件，一直在找，找了N久，只有Window TextBox的，不甘心，打开了msdn，看了看TextBox的Event，没发现什么，随后在看了input type=text的Event  
  
发现一个onpaste 因为是英文饿。。。。不懂，网上查了一下，果然是这个事件。  
  
下面是msdn中onpaste的介绍：  
Fires on the target object when the user pastes data, transferring the data from the system clipboard to the document  
  
也翻译不准确 ，大概的意思就是控制复制数据的事件。  
  
因为.Net的TextBox转换到Html就是input，不过TextBox是没有这个事件的，会有提示，无需理会。  


![](/Images/OutliningIndicators/None.gif)<asp:TextBox ID="TextBox1" onpaste="return false;" runat="server" ></asp:TextBox>

  
运行，试了一下复制粘贴，不能粘贴，但可以选择复制，不过目的达到！ 

