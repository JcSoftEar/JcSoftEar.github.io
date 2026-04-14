---
title: "url带中文参数显示乱码的问题"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# url带中文参数显示乱码的问题

> 原文链接: https://www.cnblogs.com/inday/archive/2008/01/12/1035902.html | 迁移自博客园

---

最近要上个项目，其实很简单的东西，就是拼接一个url，不过url中的参数需要UrlEncode编码的，其实对我来说，这个问题很好解决，C#用HttpUtility.UrlEncode来进行编码，asp用Server.UrlEncode来进行编码。  
  
问题解决了吗？问题刚刚开始  
  
因为这个公用转向文件，是针对所有分站的，分站代码有.net和asp两种，文件编码格式也不一样。  
  
头大的事情开始了。asp站的文件编码是gb2312，虽然.net的文件格式也是gb2312，但因为webconfig里设置的requestEncoding是utf8的，所以在接收中文的时候，无论你UrlDeCode怎么解码，哪怕你指定用gb2312解码，出来的还是乱码，那这时候你会说改下webconfig文件呀，不错！如果是你自己的小项目，这样的改动或许不算什么，可如果牵涉到很多项目，在你没办法改的情况下怎么办呢？？？？  
  
先看看例子吧：  
环境：  
asp：文件名：test.asp 文件编码：gb2312  
.net：文件名：test.aspx，test.aspx.cs 文件编码：gb2312  
.net：文件名：go.aspx， go.aspx.cs文件编码：gb2312  
test.asp 代码：  


![](/Images/OutliningIndicators/None.gif)<%  
![](/Images/OutliningIndicators/None.gif)str = Server.UrlEncode("中文测试")  
![](/Images/OutliningIndicators/None.gif)Response.Redirect "go.aspx?name=" & str  
![](/Images/OutliningIndicators/None.gif)%>

  
test.aspx.cs代码：  


![](/Images/OutliningIndicators/None.gif)string str = HttpUtility.UrlEncode("中文测试");  
![](/Images/OutliningIndicators/None.gif)Response.Redirect("go.aspx?name=" + str);

go.aspx.cs代码：  


![](/Images/OutliningIndicators/None.gif)string name = HttpUtility.UrlDeCode(Request["name"], Encoding.GetEncoding("gb2312"));  
![](/Images/OutliningIndicators/None.gif)  
![](/Images/OutliningIndicators/None.gif)Response.Redirect("http://www.xxx.com?name=  
![](/Images/OutliningIndicators/None.gif)" \+ HttpUtility.UrlEncode(name));  
![](/Images/OutliningIndicators/None.gif)

其实在go.aspx.cs中，大家以为编码定到gb2312，应该会正常了，其实错了，我跟踪了一下，在Request["name"]的时候，已经解码，解码的是按照webconfig设置的，那就是utf8。  
  
ok，.Net中，可以指定编码进行url编码，test.aspx.cs可以变成：HttpUtility.UrlEncode("中文测试", Encoding.GetEncoding("utf-8")) 这样go.aspx接收后会完全转换的。  
  
可asp的Server.UrlEncode是没有这个参数的，怎么办呢？  
2个办法：  
1、把test.asp保存为utf-8编码  
2、就是我自己想的一个不是办法的办法。  
因为前面说了，我牵涉的项目都是无法更改编码的，如果更改对网站的牵涉太大，所以只能另外想办法。  
  
在做了大量测试后，我发现UrlEncode转码后成为%AB%CD格式，大家都知道UrlEncode在转码英文的时候，会原封不动的还给你，比如你传A，接收方接收的也是A，％会转换成％25，UrlDecode解码的时候％25无论你什么编码，都会解码成％  
  
好，有思路了，假设“中文测试”编码为%AB%CD%EF%GH  


![](/Images/OutliningIndicators/None.gif)str = Server.UrlEncode("中文测试") '%AB%CD%EF%GH  
![](/Images/OutliningIndicators/None.gif)str1 = Server.UrlEncode(Server.UrlEncode("中文测试")) '%25AB%25CD%25EF%25GH  
![](/Images/OutliningIndicators/None.gif)

  
我们再改下go.aspx.cs  


![](/Images/OutliningIndicators/None.gif)Response.Write(HttpUtility.UrlDeCode(Request["str"],Encoding.GetEncoding("gb2312"));  
![](/Images/OutliningIndicators/None.gif)  
![](/Images/OutliningIndicators/None.gif)Response.Write(HttpUtility.UrlDeCode(Request["str1"],Encoding.GetEncoding("gb2312"));

  
看下go.aspx页面显示：  
第一条会显示乱码  
第二条会显示：中文测试  
  
这是什么原因呢？因为在Request的时候，因为webconfig的关系，事先已经按照utf8来进行解码了，所以你再用指定格式解码已经无济于事了。  
第二个为什么可以呢？因为我2次编码了，所以Request的时候，会事先解码成：%AB%CD%EF%GH  
所以我在用UrlDecode来进行解码，OK！任务完成。  
  
虽然我这个问题不是什么大问题，但有时候真的会让你感到头疼，为了这个问题，花了我3个小时，网上也没有任何解答，所以写下来，希望对大家有所帮助8cad0260  


