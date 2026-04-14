---
title: "js背投代码"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# js背投代码

> 原文链接: https://www.cnblogs.com/inday/archive/2009/01/12/1374158.html | 迁移自博客园

---

基本代码就以下三行，  
谁给解释解释，  
<script language="JavaScript">  
blur();  
</script>  
  
以下是全也代码：  
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">  
<HTML><HEAD><TITLE>背投广告</TITLE>  
<META http-equiv=Content-Type content="text/html; charset=gb2312">  
<META content="MSHTML 6.00.2800.1458" name=GENERATOR>  
<script type="text/javascript" src="http://image2.sina.com.cn/home/sinaflash.js"></script>  
</HEAD>  
<BODY bgColor=#ffffff leftMargin=0 topMargin=0 marginheight="0">  
<SCRIPT lanaguage="javascript">  
var par = location.search.substr(1);  
var ary = par.split("${}");  
  
if(ary[1]!="swf")  
document.write("<a href='" + ary[0] + "' target = '_blank'><img src='" + ary[2] + "' WIDTH=750 HEIGHT=450 border = 0></a>");  
else {  
  
document.write("<div id='backPop'>不支持Flash</div>");  
var FlashbackPop = new sinaFlash(ary[2], "ad_backPop", "750", "450", "7",   
"", false, "High");  
FlashbackPop.addParam("wmode", "opaque");  
FlashbackPop.write("backPop");   
}  
</SCRIPT>  
  
  
<script language="JavaScript">  
  
blur();  
self.moveTo(100,50);  
self.resizeTo(760,450);  
self.resizeTo(760,450+(450-self.document.body.clientHeight));  
blur();  
  
</script>  
  
  
</BODY></HTML>

