---
title: "Asp中如何设计跨越域的Cookie"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Asp中如何设计跨越域的Cookie

> 原文链接: https://www.cnblogs.com/inday/articles/350007.html | 迁移自博客园

---

Cookie简介 

首先，我们对Cookie做一个简单的介绍，说明如何利用ASP来维护cookie。 

Cookie是存储在客户端计算机中的一个小文件，这就意味着每当一个用户访问你的站点，你就可以秘密地在它的硬盘上放置一个包含有关信息的文件。这个文件几乎可以包含任何你打算设置的信息，包括用户信息、站点状态等等。这样的话，就有一个潜在的危险:这些信息有可能被黑客读取。为了防止这个问题的发生，一个有效的办法就是cookie只能被创建它的域所存取。这就是说:比如ytu.edu.cn只能访问ytu.edu.cn创建的cookie。通常来讲，这没有什么问题；但是，如果需要两个不同域上的两个不同站点共享保存在cookie中的用户信息，该如何处理呢?当然可以选择复制用户信，但是，如果你需要用户只能在一个站点上注册，并且自东成为另外一个站点的注册用户呢?或者，两个站点共享一个用户数据库，而又需要用户自动登录呢?这时候，跨越域共享cookie是最好的解决方案。   


  
这里，先看一些ASP处理cookie的代码，以便以后便于引用参考。 

  
'创建Cookie 

Response.Cookies("MyCookie").Expires=Date+365 

Response.Cookies("MyCookle").Domain="mydomaln.com" 

Response.Cookies("MyCookle")("Username")=strUsername 

Response.Cookies("MyCookle")("Password")=strPassword 

  
读写cookie非常简单，上面的代码创建一个cookie并给cookie设置属性:域、过期时间，以及其他一些保存在cookie中的值。这里，strUsename，strPassword是在前面某个地方设置的变量。然后，通过下面的语句在cookie中读取。 

'读取Cookie 

datExpDate=Request.Cookies("MyCookie") 

strDomaln=Request.Cookies("MyCookle").Domain 

strUsername=Request.Cookies("MyCookle")("Username") 

strPassword=Request.Cookies("MyCookie")("Password") 

更详细的信息，可以参考ASP的资料。 

实现 

简单地共享cookie的诀窍是重定向，一般过程为: 

1.一个用户点击siteA.com。 

2.如果用户没有siteA.com的cookie，就把用户重定向到siteB.com。 

3.如果用户有siteB.com的cookie，把用户连同一个特殊的标志(将在下面解释)重定向回siteA.com，否则，只把用户重定向到siteA.com。 

4.在siteA.com创建cookie。 

看起来很简单，仔细分析一下:siteA.com和siteB.com共享相同的用户设置，所以，如果用户有siteB.com的cookie(已经注册)，siteA.com能够同样读取cookie、提供cookie所允许的特性。这样，访问siteA.com的用户就如同访问了siteB.com。 

这个检查的环节应该在siteA.com中的文件所包含一个cookies.inc中实现。让我们看一下这段代码: 

  
l—1 

'SiteA.com"检查cookie 

If Request.Querystring("Checked")＜＞"True" then 

If not Request.Cookies("SiteA_Cookie").Haskeys then 

'重走向到siteB.com 

Response.Redlrect("[_http://www.siteB.com/cookie.asp_](http://www.siteb.com/cookie.asp)") 

End if 

End if 

  
如果用户有一个siteA.com的cookie，则不需要做任何事情了；第一个if语句用来消除无限的循环。让我们看一下siteB.com上的cookie.asp文件来获得进一步的理解。 

1—2 

'SiteB.com 

'检查cookie 

If not Request.Cookies("SlteB_Cookle").Haskeys then 

'重定向到 siteA.com 

Response.Redirect("[_http://www.siteA.com/index.asp" &"?checked=True_](http://www.sitea.com/index.asp"&"?checked=True)") 

Else 

'获取username 

strUsername=Request.Cookies("SiteB_Cookie")("Username") 

'将用户连同一个特殊的标志返回到siteA.com 

Response.Redlrect("[_http://www.siteA.com/index.asp" &"?checked=True"&"identrfer="&strUsername_](http://www.sitea.com/index.asp"&"?checked=True"&"identrfer="&strUsername)) 

End if 

如果用户在siteB.com上仍没有cookie，于是，将他送回到siteA.com，并且通过在查询语句中提供一个叫做"checkd"的参数让应用程序知道你已经检查过cookie了。否则，将用户送回到siteB.com，并退出循环。  
然而，如果用户拥有siteB.com的cookie，我们需要将用户送回siteA.com并告诉siteA.com。为此，我们在数据库中附加一个唯一的标志，username。所以，我们扩展siteA.com中的代码。 

l—3 

'SiteA.com   


  
... 

... 

'检查标志 

If Request.Querystring("identifier")＜＞"" then 

strUsername=Request.Querystring("identifier") 

'记录到数据库 

Response.Cookies("siteA_Cookie").Expires=Date+365 

Response.Cookies("SiteA_Cookie").Domain="siteA.com" 

Response.Cookies("siteA_Cookie")("Username")=strUsername 

End if 

最后，我们回到siteA.com。文件的第一部分(l－l)检查是否完成了cookie的检查，由于可以明显地知道已经完成(由语句中的"checked"参数表明)，进行到l—3所示的程序的第二部分。如果存在特殊的标志，我们就可以在siteA.com创建cookie。使用这个特殊的标志(在这里是username)，我们可以在任何需要的时候查询数据库。然后，设置cookie，显示页面的其他部分。如果没有指定的标志，也没必要担心，只要简单地显示页面的余下部分。 

这样，毫不费力地，siteA.com拥有了和siteB.com一样的cookie。我们可以传输更多的信息而不只是一个标志，并且，将网络流量控制在最小范围内。 

要注意一点，即使用户拥有siteA.com上的cookie，仍需要检查siteB.com。通常来讲，这不是必须的，也会节约时间。但是，一旦用户在siteB.com更改个人信息?这样做，会保持所有信息的同步。 

Cookie环 

要完成这些，我们需要两个文件:一个在原始站点服务器(siteA.com)，完成检查；一个在参考服务器(siteB.com)，验证用户。如果有一台参考服务器包含有需要的所有用户信息或cookie，就可以增加随意多的原始服务器，所需要做的就是在所有要共享cookie的服务器上增加cookie.inc文件。 

也可以以相反的次序执行，例如，如果siteB.com是原始服务器，而siteA.com包含用户信息。访问过siteA.com却从未访问过siteB.com的用户也可以登录到siteA.com，并且拥有所有的曾经的设置。注意，如果拥有多个参考服务器，这样将会很使人迷惑，并且消耗过多的资源，因为必须将用户重定向到每一台参考服务器。 

理论上讲，可以拥有一个所有站点都共享相同的用户的网络。最可行的方案就是建立共享cookie环。将参考服务器列表存储在一个地方（备份服务器），以便每个参考服务器可以查找并决定重定向用户的下一个站点。记住一定要通过查询字符串的意思跟踪用户是在哪个原始服务器开始。这样信息的传输非常迅速，这个环节变得越来越可行。 

这里还存在一些问题，首先是反应时间。对用户而言，他们最好不知道过程是怎样的。他所需的时间依赖于siteA.com、siteB.com之间的连接，有可能会比较长，在实现cookie环时可能会更长。 

再一个主要问题，就是每一个实现者大都会面对无限的重定向。这有很多原因，例如:用户的测览器不支持cookie。这就需要再设计代码来监测用户浏览器的性能。 

最好，还需要注意安全问题。如果有些黑客发现了其中的诀窍，他可能会得到cookie中的信息。最简单的防范办法就是保护参考服务器，只允许原始服务器访问Cookie.asp文件。

