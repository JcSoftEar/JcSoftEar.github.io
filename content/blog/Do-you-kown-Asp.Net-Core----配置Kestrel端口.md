---
title: "Do you kown Asp.Net Core -- 配置Kestrel端口"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Do you kown Asp.Net Core -- 配置Kestrel端口

> 原文链接: https://www.cnblogs.com/inday/p/asp-net-core-kestrel-urls-configs.html | 迁移自博客园

---

# Kestrel介绍

在[Asp.Net Core](https://www.asp.net)中，我们的web application 其实是运行在[Kestrel](https://github.com/aspnet/KestrelHttpServer)服务上，它是一个基于libuv开源的跨平台可运行 Asp.Net Core 的web服务器。

在开发阶段，我们可以直接使用Kestrel服务器用来测试，也可以使用IISExpress。在使用IISExpress其实也需要启动一个Kestrel服务器，通过IISExpress反向代理请求到Kestrel，很多时候我更喜欢使用Kestrel，因为可以实时看到log。

# 配置端口

在Socket开发中，服务器都会绑定到某个ip某个端口进行监听，等待客户端的连接，然后交换数据，Kestrel同样需要对某个端口进行监听，客户端会请求这个端口然后建立连接进行数据交换。我们说的配置url或者配置端口，其实本质上都是建立对某个端口的监听。

## 配置规则

我们知道在Kestrel通过绑定Urls参数实现绑定ip和端口，.Net Core允许我们使用多种方式来实现绑定url，我们先了解下绑定的规则：

> [http|https]😕/[ip|localhost|hostname]:port

  1. localhost 或127.0.0.1 代表本机ip,仅允许本机访问
  2. 局域网ip，允许局域网内客户端访问
  3. 端口0代表随机绑定可用端口
  4. '*' 代表0.0.0.0，允许本机、局域网、公网访问



_'*'不是特殊字符，任何不能识别成ip的字符都将会绑定到0.0.0.0，so，你看到的hostname:ip 其实并没有真正的绑定到hostname，Kestrel不会识别hostname，所以不允许像iis那样，多个application通过hostname绑定到同一个ip的同一个端口上，所以你需要通过反向代理服务器来实现_

通过上述的绑定字符串，Kestrel会解析成相应的ip和端口，然后进行绑定监听。

# 配置方式

.Net Core提供了多种对Kestrel端口的配置方式，我们可以通过编码、配置文件、命令行参数进行配置，非常便利，接下来我们来看下各种配置方式。

_无论那种方式，我们都必须在Kestrel启动之前进行，一般情况我们都在Program.cs中进行。_

## 编码方式

编码方式有2种方式：  
1、通过UseKestrel(Action):
    
    
    var host = WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()
        .UseKestrel(o =>
        {
            o.Listen(IPAddress.Loopback, 5001);
        })
        .Build();
    
    host.Run();
    

o.Listen(IPAddress.Loopback, 5004) 就是进行绑定，其中第一个参数是IPAddress类型。这种方式不是很便利，阅读性也不好，推荐使用第二种  
2、通过UseUrls方式：
    
    
    var host = WebHost.CreateDefaultBuilder(args)
        .UseStartup<Startup>()
        .UseUrls("http://localhost:5002;http://localhost:5003")
        .Build();
    
    host.Run();
    

这种方式相对简单，而且不容易出错，但灵活性不强。

## 通过配置文件

我们可以通过Json文件对Kestrel进行配置，包括我们的url。  
1、首先我们需要创建一个json文件，这里以host.json为例：
    
    
    {
      "urls": "http://*:5004;"
    }
    

2、我们需要在build host的时候告诉Kestrel读取config文件，代码如下：
    
    
    public static void Main(string[] args)
    {
        var config = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("host.json", optional: true)
        .Build();
    
        var host = WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .UseConfiguration(config)
            .Build();
    
        host.Run();
    }
    

这种方式相比编码来说较便利，但如果在web运行在容器内的话，修改还是有点麻烦，下面来看下命令行格式。

## 命令行方式

我们知道.net core我们可以使用dotnet 命令方式去运行 .net core 应用，这种方式使我们的web不再依赖于iis，实现了跨平台。  
我们先了解下命令：
    
    
    > dotnet run [options] [[--] arguments]
    

dotnet run 命令会把我们的项目编译后直接运行，在开发的时候使用，如果是编译好的项目，则使用：
    
    
    > dotnet yourproject.dll [[--] arguments]
    

如果我们需要配置Urls的话，则只要使用参数`--urls="http://*:5005"`,例如：
    
    
    > dotnet run --urls="http://*:5005"
    

如果这时候你如此运行，你会发现你的项目并未监听5005端口，因为你还没有对Kestrel进行配置，告诉其读取命令行参数，我们需要在Build host的时候进行如下配置：
    
    
    public static void Main(string[] args)
    {
        var config = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddCommandLine(args)   //添加对命令参数的支持
        .Build();
    
        var host = WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .Build();
    
        host.Run();
    }
    

ok，这时候再运行`dotnet run`命令吧！

## 关于url配置的问题

Q：url配置支持多域名吗？  
A：上面说过，kestrel是不支持主机名解析的，你进行的配置都会绑定到0.0.0.0

Q：url配置支持多个ip吗？  
A：支持，但必须是本机所属ip，否则运行则出错

Q：多个Kestrel能监听一个端口吗？  
A：不能

Q：我能通过多种方式进行url配置吗？  
A：可以，但最终生效的只有一种，也就是最后配置的方式，没有优先级

Q：Kestrel支持https吗？  
A：支持

Q：为什么其他教程中是使用servers.urls呢？  
A：我看了下，可能是扩展类的不同吧，目前来说已经改成urls了，而且不需要再额外引用其他类库了

代更。。。。。。

# 写在最后

最近在看微服务和asp.net core的东西，也希望把一些小知识分享给大家。  
最后推荐我的.Net Core QQ学习群：`376248054`（通关密码：cnblogs），最近群里不是很活跃，大家进来多发言发言哈~

