---
title: "JQuery.JCShare 0.2 发布（加入弹窗功能）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# JQuery.JCShare 0.2 发布（加入弹窗功能）

> 原文链接: https://www.cnblogs.com/inday/archive/2010/12/09/1901615.html | 迁移自博客园

---

周末没事，就在家里改进了下JCShare这个插件，此次加入了弹窗功能。

先说明下，JCShare的名字纯属是自己的英文名和老婆的英文名第一个字母，并无其他含义：）

弹窗的属性：popupModel 有3个值，分别为：

window：弹窗（window.open）   
link：链接方式   
showdialog：模态对话框（window.showModalDialog）

\-------------------------------------------------------------------------------------------------------------------------------------

简单说点原理：

分享组建目的是把页面的内容，发布到各大网站去，很多网站都提供了此类的接口，像[新浪微薄](http://t.sina.com.cn/jamesying)，[QQ微薄](http://t.qq.com)都有自己的API文档，然后申请一个Appkey，这样可以在发布后，他们能确定来源。

我们只需要利用title, url, content拼接成对应的url，即可把所需的内容发布过去。比如开心网的分享接口地址是：   
<http://www.kaixin001.com/repaste/share.php>   
它接收3个参数，rtitle、rurl、rcontent，拼接上去就ok了。

这东西挺简单的，大家随便看看 随便改改吧 哈。

PS：金婚风雨情蛮好看的，适合我们80后，嘿。

[JQuery.JCShare0.2下载](https://files.cnblogs.com/inday/JQuery.JCShare0.2.rar)

