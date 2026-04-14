---
title: "Health Check in eShop -- 解析微软微服务架构Demo（五）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Health Check in eShop -- 解析微软微服务架构Demo（五）

> 原文链接: https://www.cnblogs.com/inday/p/healthchecks-in-eshop.html | 迁移自博客园

---

# 引言

## What is the Health Check

Health Check（健康状态检查）不仅是对自己应用程序内部检测各个项目之间的健康状态（各项目的运行情况、项目之间的连接情况等），还包括了应用程序对外部或者第三方依赖库的状态检测。

## Why use Health Check

现在我们的项目越来越多的从单体多层架构转换成多项目多层架构即现在流行的微服务架构。

原来我们的App把各个模块分层分项目处理，比如Users项目仅仅处理User的一些业务需求，但在整个项目使用的时候，我们仅仅需要引用其类库即可，不用担心项目与类库之间的不兼容问题，如果不兼容在编译期已经会有提示。但如今，业务规模越来越庞大的时候，我们单独把Users作为一个service来做，所有一切都在其内部处理，对于外部来说仅仅公开几个api即可，但与项目之间的连接就从单纯的物理引用关系转换成了网络调用关系。

当我们架构从单体架构到微服务架构的时候，我们会发现越来越多的引用从物理转向了网络，在原来我们不需要考虑之间是否调用成功，但现在我们必须考虑进去，网络因素、服务器因素、其他因素等都会影响各服务之间的调用，因此Health Check孕育而生，它在微服务架构中是举足轻重的。

## Health Check’s Feathure

Health Check的功能有哪些？在微服务架构中很简单，就是检查各services的运行状态是否正常。在微服务的架构中，所有的一切都是service，db is service,rabbitmq is service,auth is service, shoppingcart is server……我们的架构能够根据业务需求，横向的扩容，多个db，多个rabbitmq，多个auth，多个shoppingcart。我们总结下，微服务架构下的Health Check是通过网络检查各services是否正常运行，它的功能是：

1、提供外部调用Health Check接口，反馈自身状态

2、检测相关service状态是否正常（比如db server，能否连接到db，能否打开数据库等）

3、UnHealthly时处理机制

# Health Check in eShop

## Why in eShop?

之前我们一直都在介绍eShop是微软基于微服务架构的.Net Core Demo，为了保障各个services之间的调用正常，所以Health Check是必不可少的。

## Where is it?

在Demo中，我们可以在各个services中都能看到HealthCheck，可以说是无处不在，在系列【[二](http://www.cnblogs.com/inday/p/identity-service-eshoponcontainers.html)】和【[三](http://www.cnblogs.com/inday/p/catalog-service-eshopOnContainers.html)】中我们都有见过。在eShop项目中，我们可以看到有个HealthChecks目录，其中包含了与HealthChecks相关的几个项目：

[![image](https://images2015.cnblogs.com/blog/4871/201707/4871-20170720115120849-716135414.png)](http://images2015.cnblogs.com/blog/4871/201707/4871-20170720115119974-1536261091.png)

Microsoft.Extensions.HealthChecks ------------ Health Check的核心代码

Microsoft.AspNetCore.HealthChecks ------------ Asp.Net Core注册扩展类库

Microsoft.Extensions.HealthChecks.AzureStorage ----- 扩展对Azure Blob Storage的支持

Microsoft.Extensions.HealthChecks.SqlServer ------ 扩展对MsSql Server的支持

通过代码了解，在eShop中实现了对各Api的通讯检测和SqlServer、AzureBlobStorage的检测，但其中并没有看到对重试机制和UnHealthy时的处理，相信以后会加入这些，目前微软已经单独为HealthChecks开了一个[Repository](https://github.com/dotnet-architecture/HealthChecks)，这样你就可以单独引用到自己的项目中，非常棒的东西。

在项目中，我们一般只会在Program.cs和Startup.cs看到跟HealthChecks相关的代码。目前仅在客户端（其他service或者我们的app）请求我们的HealthChecks的时候，我们会进行相关service的检测，然后再返回自身的一个状态码。

## How use the Healthchecks?

接下来我们看下在eShop中代码是如何使用的，我们以Identity.Api为例，在之前的[文章](http://www.cnblogs.com/inday/p/identity-service-eshoponcontainers.html)中我们提到过,在Program.cs中，有一段UseHealthChecks("/hc")，我们跟踪下代码，你会看到它会先判断path是否负责规则，如果符合的话就会通过IWebHostBuilder注册一个HealthCheckStartupFilter，Filter则会把相应的HealthCheckMiddleware注册到管道中，我们看下主要源码：
    
    
    public async Task Invoke(HttpContext context)
    {
        if (IsHealthCheckRequest(context))
        {
            var timeoutTokenSource = new CancellationTokenSource(_timeout);
            var result = await _service.CheckHealthAsync(timeoutTokenSource.Token);
            var status = result.CheckStatus;
    
            if (status != CheckStatus.Healthy)
                context.Response.StatusCode = 503;
    
            context.Response.Headers.Add("content-type", "application/json");
            await context.Response.WriteAsync(JsonConvert.SerializeObject(new { status = status.ToString() }));
            return;
        }
        else
        {
            await _next.Invoke(context);
        }
    }
    
    private bool IsHealthCheckRequest(HttpContext context)
    {
        if (_port.HasValue)
        {
            var connInfo = context.Features.Get<IHttpConnectionFeature>();
            if (connInfo.LocalPort == _port)
                return true;
        }
    
        if (context.Request.Path == _path)
        {
            return true;
        }
    
        return false;
    }

它会先检测这个请求是不是HealthCheck请求，如果不是则走下面的步骤，如果是，则会进一步进行对相关service的HealthChecks。对相关service的Config实在Startup.cs中进行的：
    
    
    services.AddHealthChecks(checks =>
    {
        var minutes = 1;
        if (int.TryParse(Configuration["HealthCheck:Timeout"], out var minutesParsed))
        {
            minutes = minutesParsed;
        }
        checks.AddSqlCheck("Identity_Db", Configuration.GetConnectionString("DefaultConnection"), TimeSpan.FromMinutes(minutes));
    });

这里可以看到，在Identity.Api中，仅仅配置了对数据库的检测。

ok，我们非常简单的在项目中引用了HealthCheck，当我们的api运行后，我们只需要通过 http://xxx/hc 就能对这个api进行Health Check了。

# 写在最后

今天我们了解了Health Check，并简单看了它在eShop中的使用。目前看来还不是很完善，只在其他service或者app调用其Health Check接口的时候才能进行检测，当然我们可以改造下，使其在程序运行的时候先检测一次。在eShop中我们并没有看到在UnHealth的时候的处理，这个扩展起来很简单，你可以通过自身需求，进行日志，email，短信都可以，后面可以找机会实现下。

乘着不忙的时候赶紧学习，如果大家有兴趣学习.Net Core的话，可以加QQ群：376248054（通关密码：cnblogs）。另外喜欢微服务的朋友可以看下园中大神[Savorboard](http://www.cnblogs.com/savorboard/)的微服务系列

