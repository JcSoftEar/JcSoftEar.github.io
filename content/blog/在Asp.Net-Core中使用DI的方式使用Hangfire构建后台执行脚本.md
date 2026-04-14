---
title: "在Asp.Net Core中使用DI的方式使用Hangfire构建后台执行脚本"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 在Asp.Net Core中使用DI的方式使用Hangfire构建后台执行脚本

> 原文链接: https://www.cnblogs.com/inday/p/hangfire-di-on-dot-net-core.html | 迁移自博客园

---

最近项目中需要用到后台Job，原有在Windows中我们会使用命令行程序结合计划任务或者直接生成Windows Service，现在.Net Core跨平台了，虽然Linux下也有计划任务，但跟原有方式一样，没撒图形界面，执行结果之类的只能去服务器查看日志。  
看了下Hangfire，基本满足于现有需求，有图形UI，注册后台Job也非常简便，考虑之下，就是用它了。

# 安装注册

Hangfire的使用也非常简单，在项目中先安装Hangfire包：
    
    
    PM> Install-Package Hangfire
    

Asp.Net Core项目的话，打开Startup.cs，在`ConfigureServices`方法中添加注册：
    
    
    services.AddHangfire(x => x.UseSqlServerStorage("connection string"));
    

`connection string`是数据库连接字符串，我用的时Sql Server，你也可以使用Redis，Mysql等其他数据库。

注册完成后，我们在Configure方法中，添加如下代码：
    
    
    app.UseHangfireServer();
    app.UseHangfireDashboard();
    

好了，等项目启动之后，Hangfire先Migration相关数据结构，项目启动之后，可以通过项目地址+`/Hangfire`查看是否运行成功，看到如下界面基本没有问题了。  
![image](https://github.com/JamesYing/mpdevclass/blob/master/blogs/20180624121943.png?raw=true)

# 基本使用

Hangfire的使用非常简单，基本上使用以下几个静态方法：
    
    
    //执行后台脚本，仅执行一次
    BackgroundJob.Enqueue(() => Console.WriteLine("Fire-and-forget!")); 
    
    //延迟执行后台脚本呢，仅执行一次
    BackgroundJob.Schedule(
        () => Console.WriteLine("Delayed!"),
        TimeSpan.FromDays(7));
        
    //周期性任务
    RecurringJob.AddOrUpdate(
        () => Console.WriteLine("Recurring!"),
        Cron.Daily);
        
    //等上一任务完成后执行
    BackgroundJob.ContinueWith(
        jobId,  //上一个任务的jobid
        () => Console.WriteLine("Continuation!"));
    

# 依赖注入

在.Net Core中处处是DI，一不小心，你会发现你在使用Hangfire的时候会遇到各种问题，比如下列代码：
    
    
    public class HomeController : Controller
    {
        private ILogger<HomeController> _logger;
        public HomeController(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<HomeController>();
        }
        public IActionResult Index()
        {
            _logger.LogInformation("start index");
            BackgroundJob.Enqueue(() => _logger.LogInformation("this a job!"));
            return View();
        }
    
    }
    

项目启动后，你能正常访问，但在Hangfire后台你会看到如下错误：

![image](https://github.com/JamesYing/mpdevclass/blob/master/blogs/20180624123053.png?raw=true)  
错误信息呢大概意思是不能使用接口或者抽象方法类，其实就是因为Hangfire没有找到实例，那如何让Hangfire支持DI呢？

我们先创建一个`MyActivator`类，使其继承`Hangfire.JobActivator`类，代码如下：
    
    
    public class MyActivator : Hangfire.JobActivator
    {
        private readonly IServiceProvider _serviceProvider;
        public MyActivator(IServiceProvider serviceProvider) => _serviceProvider = serviceProvider;
    
        public override object ActivateJob(Type jobType)
        {
            return _serviceProvider.GetService(jobType);
        }
    }
    

重写了ActivateJob方法，使其返回的类型从我们的IServiceProvider中获取。

我们试着写两个后台脚本，CheckService和TimerService，CheckService的Check方法在执行计划时，会再次调用Hangfire来定时启动TimerService：

CheckService:
    
    
    public interface ICheckService
    {
        void Check();
    }
    public class CheckService : ICheckService
    {
        private readonly ILogger<CheckService> _logger;
        private ITimerService _timeservice;
        public CheckService(ILoggerFactory loggerFactory,
            ITimerService timerService)
        {
            _logger = loggerFactory.CreateLogger<CheckService>();
            _timeservice = timerService;
        }
    
        public void Check()
        {
            _logger.LogInformation($"check service start checking, now is {DateTime.Now}");
            BackgroundJob.Schedule(() => _timeservice.Timer(), TimeSpan.FromMilliseconds(30));
            _logger.LogInformation($"check is end, now is {DateTime.Now}");
        }
    }
    

TimerService:
    
    
    public interface ITimerService
    {
        void Timer();
    }
    public class TimerService : ITimerService
    {
        private readonly ILogger<TimerService> _logger;
        public TimerService(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<TimerService>();
        }
        public void Timer()
        {
            _logger.LogInformation($"timer service is starting, now is {DateTime.Now}");
            _logger.LogWarning("timering");
            _logger.LogInformation($"timer is end, now is {DateTime.Now}");
        }
    }
    

目前还无法使用，我们必须在`Startup`中注册这2个service：
    
    
    services.AddScoped<ITimerService, TimerService>();
    services.AddScoped<ICheckService, CheckService>();
    

我们在`HomeController`修改以下：
    
    
    public IActionResult Index()
    {
        _logger.LogInformation("start index");
        BackgroundJob.Enqueue<ICheckService>(c => c.Check());
        return View();
    }
    

好，一切就绪，只差覆盖原始的Activator了，我们可以在`Startup.cs`中的`Configure`方法中使用如下代码：
    
    
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
    {
        GlobalConfiguration.Configuration.UseActivator<MyActivator>(new MyActivator(serviceProvider));
        ……
        ……
    }
    

> 默认情况下Configure方法时没有IServiceProvider参数的，请手动添加

再次启动，我们的Job就会成功执行，截图如下：  
![image](https://github.com/JamesYing/BlogsRelatedCodes/blob/master/images/20180624125657.png?raw=true)

# 参考资料

  * Hangfire 官网：<https://www.hangfire.io/>
  * Hangfire DI in .net core : <https://stackoverflow.com/questions/41829993/hangfire-dependency-injection-with-net-core>
  * Demo 地址：<https://github.com/JamesYing/BlogsRelatedCodes/tree/master/hangfireDemo>



