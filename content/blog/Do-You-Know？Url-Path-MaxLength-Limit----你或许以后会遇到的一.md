---
title: "Do You Know？Url Path MaxLength Limit -- 你或许以后会遇到的一个问题"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Do You Know？Url Path MaxLength Limit -- 你或许以后会遇到的一个问题

> 原文链接: https://www.cnblogs.com/inday/archive/2009/09/21/url-path-maxlength-limit-do-u-know.html | 迁移自博客园

---

最近一直在学习[Asp.Net MVC](http://www.asp.net/mvc)，大家都知道可以用System.Web.Routing来解析一段Url，然后到达我们Route规则定下的一个Controller，使用Url Route会使我们的Url看上去更友好一些，比如：

传统：<http://www.taogame.com/Display.aspx?id=5>

MVC：<http://www.taogame.com/Display/5>

我们通过在routes.Add添加规则就能达到这样的效果，有点类似于[iisrewrite](http://www.google.cn/aclk?sa=L&ai=CejMn74y3SpKRDpLfkAWenf30DaSp0BKi4pILmrrDNAgAEAEgx5j4BVCm3ca9AWCd0dSBsAXIAQGqBBNP0LD5dTQFX3Hlj0V57EQ06ZTu&sig=AGiWqtxlvyztlQ0Z50803bDhUoVw5_ax3g&q=http://www.isapirewrite.com)。

不过最近遇到一个问题，但我访问一个长链接时：

<http://www.taogame.com/Search/movie-5-1-3-4-12-3123-234-234-23-4-23-42-52345>-……(大于255)

这时，我们的这个访问将失败，具体原因不祥，当时[老赵](http://www.cnblogs.com/JeffreyZhao)用了iisrewrite，解决了这个问题，把一个url请求，先经过iisrewrite，把一个路径转换成了一个QueryString，即解决了这个问题。

可过了几天，又发现一个问题，当链接为：

<http://www.taogame.com/Search/movie-5-1-3-4-6-7-8-12-123-14>-……(大于260)

这时候，你的访问将返回一个Bad Request的错误信息，由于项目的特殊性，或许我们会遇到这样变态的情况，所以不得不解决，没办法，一点一点开始分析。

# 问题描述

我们的问题，是通过url请求的时候，我们的url长度过长导致，那应该从这方面着手。

# 问题分析

会不会是url maxLength Limit呢？因为之前我记得，Url是有这个限制的，在几年前我记得是255的限制，但通过搜索，我终于明白，255的限制是针对客户端的，不是对于我们IIS服务器的。不过我们的Url确实有长度限制，iis6的话，应该是2048个字符，也就是2k的数据，但我们这次的url肯定不会超过2048的，所以应该不是iis的url限制问题。

那会是什么呢？难道是iisrewrite转换后，querystring的长度限制？我进行了以下测试：

<http://www.taogame.com/Search.aspx?movie-5-1-3-4-6-7-8-12-123-14>-……（大于260）

奇怪了，能够访问，那说明也能排除这个原因了，那是什么原因呢？说明没有进入到iisrewrite，是iis抛出的错误信息。那我们只能手工去确定这个长度了：

<http://www.taogame.com/Search/movie-5-1-3-4-6-7-8-12-123-14>-…… 

细心的朋友可能看到我先前一直写了大于260，对的，通过测试，当我们的Url Path 超出260个字符的时候，iis就抛出错误信息了。

我用了Url Path 260 这几个关键字进行搜索，果然国外有很多人提出了[这个问题](http://stackoverflow.com/questions/1185739/asp-net-mvc-url-routing-maximum-path-url-length)。

# 解决方案

原因找到了，但是在找解决方案的时候，也费了不少时间，一开始以后只要修改config就万事ok了，但找了很久没有找到相关的配置说明，后来在一个论坛的别人的回复中找到了，问题也顺利解决，真是一波三折啊，所以记录下来，以后就遇到类似问题，就不用大费周章了。

> 注：修改需要改动注册表，请先备份好你的注册表，以防万一

1、开始-运行-regedit，找到HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\HTTP\Parameters项

2、创建一个DWORD值：项：UrlSegmentMaxLength 值：1000（0-32766）就是这个，这个项原先是没有的，需要你创建。

3、依次单击“开始”、“运行”，键入 Cmd，然后单击“确定”。

4、在命令提示符处，键入 net stop http，然后按 Enter。

5、在命令提示符处，键入 net start http，然后按 Enter。

6、在命令提示符处，键入 net stop iisadmin /y，然后按 Enter。   
**注意** ：所有依赖 IIS Admin Service 服务的 IIS 服务也将停止。请记下在停止 IIS Admin Service 服务时停止的 IIS 服务。在下一步中，将需要重新启动其中的每项服务。

7、重新启动在步骤 4 中停止的 IIS 服务。为此，请在命令提示符处键入 net startservicename，然后按 Enter。在该命令中，servicename 是要重新启动的服务的名称。例如，要重新启动 World Wide Web Publishing Service 服务，请键入 net start "World Wide Web Publishing Service"，然后按 Enter。

好了，再次浏览我们的url，就能顺利访问了。问题解决。

问题解决了，我非常想知道为什么是260个字符限制呢？通过查找，原来是因为windows的物理路径，限制了260个字符，所以默认情况下，url的虚拟路径（斜线内字符）也限定了260.。。。无比晕倒啊，不过好在有解决方案，否则真是欲哭无泪了，当然是可以用其他方法绕开，但这样能完美解决，何乐而不为呢？

PS：此文只是对一个问题的解决方案，或许你现在没有遇到，但我很希望大家收藏一下，因为这个问题如果第一次遇到，真的会花很多时间。附[原文解决方案](http://support.microsoft.com/kb/820129)和[IIS7解决方案](http://support.microsoft.com/kb/944836)（iis7还没有试过，大家可以试试）

