---
title: "微信公众平台快速开发框架 For Core 2.0 beta –JCSoft.WX.Core 5.2.0 beta发布"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 微信公众平台快速开发框架 For Core 2.0 beta –JCSoft.WX.Core 5.2.0 beta发布

> 原文链接: https://www.cnblogs.com/inday/p/dotnet-core-weichat-quickframework-beta.html | 迁移自博客园

---

# 写在前面

最近比较忙，都没有好好维护博客，今天拿个半成品来交代吧。

记不清上次关于微信公众号快速开发框架（简称JCWX）的更新是什么时候了，自从更新到支持.Net Framework 4.0以后基本上就没怎么维护了，一方面工作比较忙，一方面家庭也需要维护，男人，你懂的。

自从NetCore发布以后，一直想把JCWX更新到Core版本，从6月开始就着手更新了，大概花了一个月时间，更新到了Net Core 1.1版本，当时并没有对外公开，只是在Nuget上发布了下，随后8月的时候2.0发布了，借着机会，我把代码更新了下，使其支持.Net Core 2.0，也就是现在你看到的版本。

在更新到Net Core 1.1的时候，原本不打算继续了，因为苏大大的公众号SDK已经非常强大了，不过，没想到在Nuget上未公开的版本竟然也有上百名开发者下载使用，这让我很感动，所以我决定坚持下去。

为了与之前的版本区分，我在Github上新建了项目：<https://github.com/JamesYing/JCWXCore>

目前我在[dev Branch](https://github.com/JamesYing/JCWXCore/tree/dev)上进行开发，您可以从Dev上获取最新的开发信息。

如果您之前不了我的项目，您可以点击【[传送门](http://www.cnblogs.com/inday/category/571092.html)】进行了解

为项目开了个网站：<http://www.wxquickframework.com>

使用方式：

1、可以Clone <https://github.com/JamesYing/JCWXCore.git> 后编译后引入您的项目

2、通过Nuget 控制台：Install-Package JCSoft.WX.Framework -Version 5.2.0

# 更新内容

## 一、支持服务注册

我们知道Asp.Net Core的DI是非常强大的，通过在Startup.cs中，把我们的服务注册到程序中。JCWXCore也支持DI方式注册。

使用过JCWX的朋友应该知道，我在调用Api的时候，使用了接口IApiClient，在代码中我也提供了一个默认的ApiClient：DefaultApiClient。

在JCWXCore中，我们依然使用IApiClient接口作为主要调用接口，在DefaultApiClient中，我依赖了ILogger和IHttpFactory，您可以通过DI注册属于你自己的服务。

> IHttpFactory目前仅仅支持Get和Post，并没有提供UploadFile，希望朋友能一起完善

在.Net Core中，我们使用非常方便，只需要在Startup.cs的ConfigureServices中添加如下代码：
    
    
    public void ConfigureServices(IServiceCollection services)
    {
        //add wx quickframework service
        services.AddWXFramework();
    
        services.AddMvc();
    }

注册之后，我们就可以在项目中任何地方使用了，比如在Controller中：
    
    
    public class TestController:Controller
    {
      private readonly IApiClient _client;
      public TestController(IApiClient client)
      {
          _client = client;
      }
    
      public ActionResult Test(ApiRequest request)
      {
          var response = _client.Execute(request);
    
          return Json(response);
      }
    }

## 二、支持配置

到了.Net Core，我们使用json文件方式进行配置，这里我支持了通过Json配置文件配置和服务注册时配置

1、Json文件配置（一般时appsettings.json）：
    
    
    {
      "AppId": "AppId",
      "AppSecert": "AppSecert",
      "EncodingAESKey": "EncodingAESKey",
      "Token": "Token",
      "MessageMode": 2 //0:明文 1：兼容 2：密文
    }

  


2、服务注册时：
    
    
    public void ConfigureServices(IServiceCollection services)
    {
        //add wx quickframework service
          services.AddWXFramework(o =>
          {
              o.AppId = "123";
              o.AppSecert = "123123";
              o.Token = "123123";
              o.MessageMode = MessageMode.Cipher;
              o.EncodingAESKey = "encodingAESKey";
          });
    
        services.AddMvc();
    }

目前来说配置并不是很完善，我将在下一版本中，使其能够根据配置文件，自动获取AccessToken，方便大家使用。

## 三、自动被动消息加解密

细心的朋友一定注意到在配置信息中，有一个MessageMode的枚举，以前比较偷懒，一直没有加支持，这次终于把加解密给加上去了，为了更好的体验，我把被动消息加解密做成了自动解密，自动加密。

在开发的时候我并没有采用中间件的方式做自动加解密，而是采用了添加InputFormatter和OutputFormatter的方式。

如果需要使用自动加解密，需要进行如下步骤：

1、配置MessageMode为兼容模式或者密码模式

2、引用“using JCSoft.WX.Mvc.Formatters”，可以通过Nuget控制台引入：

Install-Package JCSoft.WX.Mvc.Cores -Version 1.2.0

3、在Startup.cs的ConfigureServices中把InputFormat和OutputFormat添加进去：
    
    
    services.Configure<MvcOptions>(options =>
    {
        options.InputFormatters.Add(new WechatXmlSerializerInputFormatter(
                Configuration.GetValue<string>("Token"),
                Configuration.GetValue<string>("EncodingAESKey"),
                Configuration.GetValue<string>("AppId"),
                Configuration.GetValue<MessageMode>("MessageMode")
            ));
    
        options.OutputFormatters.Add(new WechatXmlSerializerOutputFormatter(
                Configuration.GetValue<string>("Token"),
                Configuration.GetValue<string>("EncodingAESKey"),
                Configuration.GetValue<string>("AppId"),
                Configuration.GetValue<MessageMode>("MessageMode")
            ));
    });

> 这里的代码不是很好看，如果有更好的方法，请艾特我。

为了测试自动加解密，我做了一个demo项目：PassivityRequestMessageDemo

因为测试公众号被动消息接口必须使用80端口，家里的电信猫无法映射80，我就把它build了一个镜像，使其在docker容器中运行，您也可以进行操作下：）

## 四、增加部分API

因为很久没有更新了，所以很多新的API都没有支持，这次我添加了一些，但估计有远远不够，希望大家能够一起来帮我添加。

目前来说现在应该有80%的Api了，但还是真心希望找几个志同道合的一起维护，有兴趣的请添加我的QQ：785418

# 写在最后

这次把JCWX更新到Core，不仅仅是为了项目升级，更是对.Net Core的一次学习，包括Docker化等等，让我学到了很多，也踩了很多坑。不过一个人的力量真的有限，现在每天的生活就是工作-带娃-锻炼-学英文 一个循环下来已经晚上11点，真的力不从心，只能中午抽空修改，在这里也对大家说声抱歉。

自从换了工作后，我养成了如下习惯：

1、习惯邮件发送问题

2、习惯做TodoList

3、开始坚持锻炼（瘦了20斤）

4、戒烟成功

5、每天学习15个英文单词

6、每天看半小时书

现在感觉每天都不够用，写代码，带娃，锻炼，学习，连写博客都有点奢侈。

.Net Core真的是好东西，但是在国内应用真的不多，希望大家一起加入，壮大国内的社区。

如果您是.Net Core爱好者，可以考虑加入我的QQ群：376248054（最近气氛不加，希望大家踊跃啊）

