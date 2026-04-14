---
title: "开篇有益-解析微软微服务架构eShopOnContainers（一）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 开篇有益-解析微软微服务架构eShopOnContainers（一）

> 原文链接: https://www.cnblogs.com/inday/p/6908515.html | 迁移自博客园

---

为了推广.Net Core，微软为我们提供了一个开源Demo-eShopOnContainers，这是一个使用Net Core框架开发的，跨平台（几乎涵盖了所有平台，windows、mac、linux、android、ios）的，基于微服务架构的，运行在容器中的小型应用，其不仅展示了.Net Core的跨平台性，更展示了VS2017的强大，所有代码都在VS2017下开发。从名字上可以看出，这是一个运行在容器上的电子店铺应用，利用Docker的跨平台性，使我们可以“build once, run anywhere”。

一、介绍

eShopOnContainers是基于微服务架构和Docker容器的一个简单的.Net Core的应用。目前微服务架构如火如荼，docker技术也发展迅速，微软在这时推出这个Demo，其用意可想而知，虽说这个Demo还不能完全应用到生产环境，但对于我们开发者来说，可是非常好的学习资料，无论你是稍作修改还是利用架构重新开发，学习这样一个Demo都是非常有必要的，这让我想起以前学习BlogEngine.Net。

二、架构

我们看下微软提供给我们的架构图

![](http://note.youdao.com/yws/public/resource/b0c40201bfba5e4a9a181db094210413/xmlnote/31FE6809FC5E42A29564268C478A0D69/189)

从左到右我们看到有2个虚线框，左边是各个客户端应用，右边是假设在Docker上的web应用、微服务应用和数据库。

在Demo中，微软根据不同功能分别搭建了多个service，而且在设计这几个service的时候，微软又使用了不同的方式来实现，如下图所示：

![](http://note.youdao.com/yws/public/resource/b0c40201bfba5e4a9a181db094210413/xmlnote/10F7BC1686C44876805118D4BF77083B/207)

以上是微软在Demo中展示的四种services，你还可以使用不同的框架，不同的数据库完成你的微服务搭建，这就是微服务为何如此流行的原因了。我可以利用任何语言，任何数据库都能搭建我的服务，无论我的调用端使用的何种语言，何种系统。

三、源代码

这套架构在Github上开源，地址：<https://github.com/dotnet-architecture/eShopOnContainers>

我们可以通过git把源代码clone下来：

![](http://note.youdao.com/yws/public/resource/b0c40201bfba5e4a9a181db094210413/xmlnote/31DB44CC4EE14C0E9AA730C63546588C/219)

我们看到里面有3个sln，建议用vs2017打开，如果你安装了完整版，你可以打开eShopOnContainers.sln，不过一般对于初学者来说，我们还是打开eShopOnContainers-ServicesAndWebApps.sln解决方案。

![](http://note.youdao.com/yws/public/resource/b0c40201bfba5e4a9a181db094210413/xmlnote/B37486F3E3CE45999746029371736863/228)

可以看到在解决方案中已经涵盖了webapp和service app，我们的教程也是以这个solution为准。

四、必要环境：

之前说过我们的应用是跨平台的，可以运行在任何支持Docker的操作系统之上，但在我们开发调试的时候，我们需要相应的环境才能进行调试（当然你也可以使用iisexpress进行调试）

1、64bit Windows 10 Pro

2、开启Hyper-V（微软的虚拟机）

3、[安装Docker for Windows](https://www.docker.com/community-edition)

如果我们是win10之前的版本，我们虽然可以安装[Docker Toolbox](https://docs.docker.com/toolbox/overview/#whats-in-the-box)，但是没办法利用VS2017进行Docker调试，运行时会报错，为了这教程，我决定把我电脑升级到Win10，这样才能更好的展示。

如果你想在之前的系统下进行调试运行，除了安装Docker Toolbox外，您还需要安装：

1、[NodeJS](https://nodejs.org/zh-cn/)

2、[Bower](https://bower.io/)

Docker for Windows 在win10或者server 2016上有2种类型的容器，Linux container 和Windows Container，这里我们只需要使用Linux Container即可（默认）。我们的教程只针对Services和WebApp，微软建议设置Docker的使用内存是4096M（4G）和CPU 3，如果你要运行完整版（包含手机客户端），那你需要为Dockere配置16G内存。

我个人建议的话，你最好有台专门放数据库的机器，否则一个[mssql-linux-sql docker](https://store.docker.com/images/mssql-server-linux)都需要4G内存，不用说还需要搭建一个redis。

我们在学习的时候，我们不一定要使用Docker进行调试，利用iis express也可以，用哪种方式不重要，重要的是学习。

五、学习步骤：

本系列讲解的都是以ServicesAndWebApps.sln代码为准，我们将先从微服务学习，再看web部分的代码结构。大致的顺序如下：

1、Identity service

2、Catalog Service

3、Ordering Sevice

4、Basket Service

5、WebApp Mvc

6、WebSPA

* * *

写在最后：

前段时间比较忙，但一直非常关注.Net Core的发展，在之前的builder大会上，2.0的惊艳亮相，彻底让我相信微软会不惜余力的发展.Net，也使我等.Net Developer感觉到春天到了，至此为天下所有.Net Developer致敬，我们等了10年啊。

为什么挑这个架构来说呢，因为这是微软写的，很有教学意义，而且现在微服务和Docker概念越来越火，目前的公司是基于服务做的（还没有到达微服务概念），在部署、开发、维护、扩展上都有很多不便，所以这个学习对我来说非常重要。

第一篇比较偏废话些，后面会围绕代码和架构和设计模式进行讲解，欢迎大家订阅。最后来一张效果图

![](http://note.youdao.com/yws/public/resource/b0c40201bfba5e4a9a181db094210413/xmlnote/C7D93019D56F441ABA291B4B2F880B39/320)

