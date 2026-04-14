---
title: "E路阳光"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# E路阳光

> 原文链接: https://www.cnblogs.com/inday/archive/2004/12/24/81651.html | 迁移自博客园

---

早上没事情做，随便打开了一个文件夹（e路阳光论坛）   
论坛是dvbbs 7.0 sp2的，做了界面放了些插件，看着目录，看到几个插件的文件，随便打开一个。。。。。。。。晕死，低级漏洞，没过滤，测试一下，我日，只是个弹出界面，不想利用，再找其他插件文件，还是一样，没过滤   
文件：checksheep.asp   


![](/Images/OutliningIndicators/None.gif)sub checksheep()   
![](/Images/OutliningIndicators/None.gif)dim username   
![](/Images/OutliningIndicators/None.gif)username=dvbbs.membername   
![](/Images/OutliningIndicators/None.gif)if username="" then   
![](/Images/OutliningIndicators/None.gif)response.redirect"login.asp"   
![](/Images/OutliningIndicators/None.gif)exit sub   
![](/Images/OutliningIndicators/None.gif)end if   
![](/Images/OutliningIndicators/None.gif)dim sheepname,sheepid   
![](/Images/OutliningIndicators/None.gif) sheepid=request("id")   
![](/Images/OutliningIndicators/None.gif) dim dellifeday,sheeptype,sheeppic,milkname,milkprice,eatname,eatplushungry,cleanplusclean,sunplushealth,peiplushappy,uplife   
![](/Images/OutliningIndicators/None.gif) dim freezpay   
![](/Images/OutliningIndicators/None.gif) set conn1=server.createobject("adodb.connection")   
![](/Images/OutliningIndicators/None.gif) conn1.open dbname   
![](/Images/OutliningIndicators/None.gif) set rs=server.createobject("adodb.recordset")   
![](/Images/OutliningIndicators/None.gif) rs.open"select * from sheep where id="&sheepid&" and username='"&username&"'",conn1,1,1   
![](/Images/OutliningIndicators/None.gif) if rs.bof then'没找到宠物   
![](/Images/OutliningIndicators/None.gif) %>   
![](/Images/OutliningIndicators/None.gif) <script language="Vbscript">   
![](/Images/OutliningIndicators/None.gif) msgbox"您不是这只宠物的主人！",0,"提示"   
![](/Images/OutliningIndicators/None.gif) history.back   
![](/Images/OutliningIndicators/None.gif) </script>   
![](/Images/OutliningIndicators/None.gif) <%   
![](/Images/OutliningIndicators/None.gif) rs.close   
![](/Images/OutliningIndicators/None.gif) conn1.close   
![](/Images/OutliningIndicators/None.gif) exit sub

  
找到漏洞了，测试也通过，其实我觉得动网现在已经很安全了，听说sp3马上要出来了，经过几年的风雨，动网一定会成为论坛的主导者，不过个人认为还是插件少放点，毕竟不是动网的人员写的。这个插件实在。。。。。。。。一点过滤都没有，无语了，还可以通过欺骗进入到后台。   
时间不早了，上班，圣诞快乐 

