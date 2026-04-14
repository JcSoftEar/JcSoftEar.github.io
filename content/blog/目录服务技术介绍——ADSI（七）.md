---
title: "目录服务技术介绍——ADSI（七）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 目录服务技术介绍——ADSI（七）

> 原文链接: https://www.cnblogs.com/inday/articles/221371.html | 迁移自博客园

---

了解了客户程序的编程方法以及ADSI提供者的基本内容之后，现在我们来看看从客户程序到ADSI提供者组件的交互过程(如图4所示)，以便加深读者对ADSI的理解。 

图4 客户程序与ADSI提供者的交互过程

客户程序首先向ADSI发一个对象绑定请求(图中步骤1)，ADSI组件根据客户给出的ADSI对象路径，提取出标识提供者ProgID的字符串，比如“WinNT”、“LDAP”或者自定义的提供者ProgID，进一步在注册表中找到此ProgID所对应的CLSID(图中步骤2)。然后装入提供者组件程序(图中步骤3)，接下去的任务就交给提供者组件，由它创建对象并返回给ADSI组件(图中步骤4)，进一步返回给客户程序(图中步骤5)。以后客户与目录对象直接进行通讯(图中步骤6)。这是客户绑定ADSI目录对象的实现过程。

四、ADSI例程序

这一部分我们将介绍一个ADSI例程序dsbrowse，它是一个VB表单窗口程序，此程序可以对当前机器上的所有ADSI提供者进行浏览，图5分别给出了dsbrowse运行的初始状态以及打开NT域之后的目录对象列表图。

(a) 初始运行状态 (b) 打开WinNT域之后的状态 

图5 例程序dsbrowse运行示意图

dsbrowse例程序非常简单，在表单窗口的初始化函数中，根据程序指定的根路径，对它所包容的对象进行枚举。缺省情形是，我们在初始路径中指定“ADS:”，它是ADSI的总根，包容了当前机器上的所有名字空间，如图5(a)所示，dsbrowse列出了当前机器上的5个名字空间：IIS、LDAP、NDS、NWCOMPAT和WinNT。有的名字空间需要指定相应的[服务器](http://www.21tx.com/server/)，不能进行无服务器枚举，所以我们不能直接用dsbrowse进行枚举，但有的名字空间可以进行无服务器枚举，对这种名字空间我们可以点击名字空间前的加号即可列出它所包容的目录对象或者子包容器对象。比如，我们在“WinNT”名字空间点击可列出当前网络环境下所有的NT域，进一步在某个NT域名上点击可列出此域中所有的目录对象，包括此域的用户、计算机、用户组、服务等对象。

我们在窗口的树状控制中选中某个对象，再点击右上角的“Properties”按钮，dsbrowse程序会用一个对话框显示被选中对象的属性信息，如图6所示。属性对话框列出了相应对象的名字、路径、是否为包容器对象、以及它的属性表，用户可以通过下部的控制修改对象的属性。

图6 例程序dsbrowse的属性对话框

读者可以从Visual Studio的Visual C++ Sample中得到dsbrowse程序的主要源代码，源代码位于Samples\sdk\netds\adsi\sampapp\dsbrowse目录下。在sampapp目录下还有一个Visual C++的例程序AdsCmd，它可以直接通过命令行参数访问指定目录对象，也可以列出包容器对象的所有子对象。比如，我们可以通过AdsCmd列出Microsoft Exchange Server的邮箱信息：

AdsCmd list LDAP://MailServer/cn=Recipients,ou=MySite,o=MyOrganization

我们也可以让AdsCmd程序直接给出指定路径的目录对象的属性信息，例如：

AdsCmd dump LDAP://MailServer/cn=PanAimin,cn=Recipients,ou=MySite,o=MyOrganization

当然，AdsCmd不仅可以访问Microsoft Exchange Server的用户信息，也可以访问其它任意名字空间的目录服务信息。

五、结束语

ADSI是一项正在发展中的技术，它体现了网络时代访问和管理信息的基本思想。Microsoft正逐步把它标准化，ADSI也将成为Windows 2000[操作系统](http://dev.21tx.com/os/)的一项新特性，虽然我们在Windows NT 4.0以及一些应用软件中已经看到了ADSI的应用，但无论是WinNT或者是用于Microsoft Exchange Server用户访问的LDAP协议，ADSI的支持都是不完全的，我们还无法通过WinNT名字空间添加NT用户。虽然ADSI支持Windows NT的安全特性，但实际上这种特性还有待于进一步完善。

ADSI技术的全面应用必须要等到Windows 2000发布之后才有可能。随着Windows 2000发布日的临近，ADSI最终必将统一目录服务接口。作为Windows程序员，我们必须对此作好准备。本文对ADSI作了基本的介绍，文中提到的接口或者基本原则不会再变化，但个别细节有可能在新的版本中有所不同。请读者在使用中注意这一点。  


