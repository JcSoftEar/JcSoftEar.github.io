---
title: "转换程序的一些问题：设置为 OFF 时，不能为表 'Test' 中的标识列插入显式值。8cad0260"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 转换程序的一些问题：设置为 OFF 时，不能为表 'Test' 中的标识列插入显式值。8cad0260

> 原文链接: https://www.cnblogs.com/inday/archive/2008/01/05/1026671.html | 迁移自博客园

---

因为先前的转换程序备份都没了：（ 现在又重新开始学2005，所以借此准备再次写一个转换程序（针对asp.net forums）  
  
考虑到一个问题，先前我都是靠内部存储过程进行注册、发帖、建立版面的，可这次我是想在此基础上，能变成能转换任何论坛的，因此不想借助他自带的存储过程。  
  
先前有一点很难做，因为一般的主键都是自动递增的，在自动递增的时候是不允许插入值的，这点让我一只很烦，今天有时间，特地建立了一个表来进行测试  


字段名 | 备注  
---|---  
ID | 设为主键 自动递增  
Name | 字符型  
  
  
建立以后，我先随便输入了一些数据（当中输入的时候，ID是不允许输入的，但会自动递增）  
  
随后我运行一条Sql语句：  


![](/Images/OutliningIndicators/None.gif)insert into [Test] (id,name) values (4,'asdf');

  
很明显，抛出一个Sql错误：  
消息 544，级别 16，状态 1，第 1 行  
当 设置为 OFF 时，不能为表 'Test' 中的标识列插入显式值。   
  
网上查找了一下，可以利用Set IDENTITY_INSERT On来解决这个问题。  
  
至此，我只要在转换插入数据的时候，利用一个事务进行插入工作  


![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)Set IDENTITY_INSERT [TableName] On;  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)Tran  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)Insert Into![](https://www.cnblogs.com/Images/dot.gif).  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)Set IDENTITY_INSERT [TableName] Off;

ok,成功插入数据，目的达到。  
写这文章不是为了什么，就为了自己能记住，让自己以后能熟练运用。  
  
PS1:今天公司上午网站出现问题，造成了很严重的后果，我很坚信我的同事不会犯connection.close()的错误，错误原因还没有查到，星期一准备接受全体惩罚  
PS2：年会要到了，要我表演节目，晕死，还演很抽象的人物，诶，看来以后在公司是没法见人了![](https://www.cnblogs.com/Emoticons/qface/055243621.gif)

