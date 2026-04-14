---
title: "Identity Service - 解析微软微服务架构eShopOnContainers（二）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Identity Service - 解析微软微服务架构eShopOnContainers（二）

> 原文链接: https://www.cnblogs.com/inday/p/identity-service-eshoponcontainers.html | 迁移自博客园

---

接[上一篇](http://www.cnblogs.com/inday/p/6908515.html)，众所周知一个网站的用户登录是非常重要，一站式的登录（SSO）也成了大家讨论的热点。微软在这个Demo中，把登录单独拉了出来，形成了一个Service，用户的注册、登录、找回密码等都在其中进行。

这套service是基于[IdentityServer4](https://github.com/IdentityServer/IdentityServer4)开发的， 它是一套基于 .Net Core的OAuth2和OpenID框架，这套框架目前已经很完善了，我们可以把它使用到任何项目中。

我们先看下目录结构：

![image](http://note.youdao.com/yws/public/resource/669b1578bc9949d36a617cf65442c585/xmlnote/4684CDAB4E4341B2AAC8BC83C8B8A2C3/433)

从目录结构可以看出它是一套MVC架构的网站，我们可以单独进行运行和调试，当然，我们也可以把它放进自己的项目中。

从.Net Core开始，我们看代码的顺序从Web.config转到了Program.cs中，我们来看下IdentityService的Program：
    
    
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseHealthChecks("/hc") //多了一个健康检查
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();
    
            host.Run();
        }
    }

跟普通的.Net Core项目类似，不过多了一个UseHealthChecks，从名字上也能看出，这是一个对项目健康的检查，有兴趣的话到时候我们另外开篇介绍。看完Program我们看下Startup

在初始化的时候，我们看到的代码基本与系统相同，多了一个加入builder.AddUserSecrets()， 这是一个用户信息加密方法，避免我们在提交共享项目的时候，会把自己一些重要信息泄露，有兴趣的朋友可以看下[Secret Manager Tools](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets)。

在ConfigureServices中，我们看到有一段代码：
    
    
    services.AddDataProtection(opts =>
    {
        opts.ApplicationDiscriminator = "eshop.identity";
    });

这段代码意思是加了一个唯一标示符给应用程序，这在集群环境中是非常必要的，我们可以通过这个唯一标识来判断是否是同一个应用（我们的同一应用可能会分布在不同server上），具体可以看园内大神的专题：[Asp.Net Core 数据保护](http://www.cnblogs.com/savorboard/p/dotnetcore-data-protection.html)

Going Down:
    
    
    services.AddHealthChecks(checks =>
    {
        var minutes = 1;
        if (int.TryParse(Configuration["HealthCheck:Timeout"], out var minutesParsed))
        {
            minutes = minutesParsed;
        }
        checks.AddSqlCheck("Identity_Db", Configuration.GetConnectionString("DefaultConnection"), TimeSpan.FromMinutes(minutes));
    });

又是Health检查，这次检查了与数据库连接的状态。
    
    
    services.AddTransient<IEmailSender, AuthMessageSender>();   //邮件发送服务
    services.AddTransient<ISmsSender, AuthMessageSender>();     //短信发送服务
    services.AddTransient<ILoginService<ApplicationUser>, EFLoginService>();    //EF 登录服务
    services.AddTransient<IRedirectService, RedirectService>(); //重定向服务
    
    //callbacks urls from config:
    Dictionary<string, string> clientUrls = new Dictionary<string, string>();
    clientUrls.Add("Mvc", Configuration.GetValue<string>("MvcClient"));
    clientUrls.Add("Spa", Configuration.GetValue<string>("SpaClient"));
    clientUrls.Add("Xamarin", Configuration.GetValue<string>("XamarinCallback"));
    
    // Adds IdentityServer
    services.AddIdentityServer(x => x.IssuerUri = "null")
        .AddSigningCredential(Certificate.Get())
        .AddInMemoryApiResources(Config.GetApis())
        .AddInMemoryIdentityResources(Config.GetResources())
        .AddInMemoryClients(Config.GetClients(clientUrls))
        .AddAspNetIdentity<ApplicationUser>()
        .Services.AddTransient<IProfileService, ProfileService>();

为identityserver4 进行相关配置。Startup中的Configure没什么特别的。

简单的看了下Identity项目，好像就是教你怎么使用IdentityServer4，So，你可以在博客园中找到好多相关资料，这里就不重复介绍了。

在这个service中，发现了很多没有用到的类和属性，估计是为了以后扩展用的吧。

例如：
    
    
    var user = await _loginService.FindByUsername(model.Email);
    if (await _loginService.ValidateCredentials(user, model.Password))
    {
        AuthenticationProperties props = null;
        if (model.RememberMe)
        {
            props = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddYears(10)
            };
        };
    
        await _loginService.SignIn(user);
        // make sure the returnUrl is still valid, and if yes - redirect back to authorize endpoint
        if (_interaction.IsValidReturnUrl(model.ReturnUrl))
        {
            return Redirect(model.ReturnUrl);
        }
    
        return Redirect("~/");
    }

这是AccountController用户登录的一段代码，其中的props属性进行了设置，但是在后面没有使用到，因为是为以后支持持续化登录做的准备吧。还有在Services目录中的ProfileService，在项目中也没有进行调用，相信在后面的版本中会加上去的。

# 运行部署

了解了项目后，我们再来进行运行和部署。

首先，我们需要一台MSSQL Server，因为我们需要保存用户数据，建议用SQL 2008 update3以上，为何用update3以上后面会说，当然你也可以使用其他类型的数据库，比如MySql，Sqlite等。

其次，把Identity项目设置为启动项目，试着Ctrl+F5运行，看看是否运行成功。

[![afdd4fc5-de60-4ac6-ba1e-32bf2a776271](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091536571-779067037.gif)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091529430-2056727170.gif)

当你能在浏览器看到这个页面的时候，说明程序运行正常，配置也正确，接下来看下如何在docker中运行。

1、右键项目-发布，把项目编译发布到某个文件夹中。

2、打开你的终端，如果是win10之前的系统，请打开Docker Quickstart Terminal

我用的是win7，使用的是Quickstart终端，其他系统只要是使用linux container的都一样，否则怎么叫“build once, run anywhere”呢。

3、在终端上先cd到你的发布目录，如果不在同一个驱动器下的，使用 /(driver)/ 代替driver:,例如，我的项目发布在D:\Projects\publish
    
    
        cd /d/projects/publish

在你的终端看到输入处上一行有这个目录的，说明你已经进入到这个目录了，如：

[![image](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091543446-1040769079.png)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091542149-1974635836.png)

4、用ls查看下这个目录，你会看到编译后的文件都在这里（release），在文件夹中，你会看到dockerfile文件，这个相当于docker的批处理文件，我们看下内容，具体如何写，可以看博客园中其他大神的教程：
    
    
    FROM microsoft/aspnetcore:1.1
    ARG source
    WORKDIR /app
    EXPOSE 80
    COPY ${source:-obj/Docker/publish} .
    ENTRYPOINT ["dotnet", "Identity.API.dll"]
    

5、在终端运行docker build命令，创建你的image（请注意最后的“.”，这个代表的当前目录）：
    
    
    docker build -t identity:01 .

6、成功后，我们使用docker images 可以查看，如果在list中有identity的话，说明我们创建成功了

7、run起来  


docker run -p 8888:80 --name identity -d identity:01

ok，所有操作完毕，可以用我们的浏览器打开，输入<http://localhost:8888>了

[![image](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091546243-2084669496.png)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091544602-1885775412.png)[![image](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091548508-387692193.png)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091547430-40799433.png)

撒都没有，撒情况！！！！

通过检查，终于知道了原因，我们使用的docker-toolbox，所以它会借助于VritualBox来创建一个linux运行环境，所以我们必须把虚拟机中的端口映射到我的本机！

[![d01f9762-76dd-45a4-82f3-a79f54b40718](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091556555-1601438086.gif)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091551946-1067956727.gif)

想着这下总归可以了吧，谁知道。。。。。还是无法访问，在quickstart中，我输入了docker logs identity 看到如下日志：

[![image](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091559493-1592048425.png)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091558696-1358672234.png)

这什么鬼，time out！！可我iis运行都是正常的啊，不存在数据库连接不上的问题吧！这个问题足足困扰了我2天，晚上也睡不好，第3天早上，突然想到会不会linux容器的关系呢？之前google的都是错误信息，所以撒都没有搜出来，我改了下关键字 linux containers connection sqlserver，果不其然，在一个issue中发现了答案：

<https://github.com/aspnet/EntityFramework/issues/4702#issuecomment-193382793>

原来我们的sql2008没有支持这种登录request，我们必须升级到update3才能解决这个问题，为了让教程继续，我购买了azure的1元试用，更换了connection后，我重新build和run，终于看到了熟悉的页面：

[![image](https://images2015.cnblogs.com/blog/4871/201705/4871-20170531091603414-655116849.png)](http://images2015.cnblogs.com/blog/4871/201705/4871-20170531091602118-920931385.png)

## 

# 写在最后

在Identity Service中，我们看到了一些新的东西，比如secret manager tool,healthcheck等，虽说它是基于identityServer4搭建的，但至少它教会了我们如何使用identityServer4，而且我们完全可以单独把它拉出来作为我们自己的user server，我也是第一次接触IdentityServer4，以后大家可以一起学习讨论下，感觉非常强大。最后我们学习了如何单独搭建和部署identity service，并使其能够在docker中正常运行。

PS：最近工作不是很忙，所以有些时间去研究这些，如果中途断档的话，还请大家见谅！

