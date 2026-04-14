---
title: "Do You Kown Asp.Net Core - 根据实体类自动创建Razor Page CURD页面模板"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Do You Kown Asp.Net Core - 根据实体类自动创建Razor Page CURD页面模板

> 原文链接: https://www.cnblogs.com/inday/p/scaffolding-template-on-asp-net-core-razor-page.html | 迁移自博客园

---

# Scaffolding Template Intro

我们知道在Asp.Net MVC中，如果你使用的EF的DBContext的话，你可以在vs中通过右键解决方案-添加控制器-添加包含视图的控制器，然后vs会根据你选择的Model自动生成相应的CURD的控制器和View，非常便利，这种就叫做 ASP.NET Scaffolding Template，之前雪燕大大有过一篇介绍，有兴趣可以看看【[传送门](http://www.cnblogs.com/codelove/p/4251533.html)】

大家知道近期Asp.Net Core2.0发布了，微软也推出了[Razor Page](http://www.cnblogs.com/inday/p/razor-page-in-asp-net-core-2.html)来作为默认的Asp.Net Core Web项目，但一开始并没有提供Scaffolding Template（后简称ST）功能，使我们每次对于一个Model需要进行4-5个页面和PageModel的编写，代码量比Asp.Net MVC多了不少，好在ST及时出现，不过这次并没有结合到VS中，我们需要通过添加一个生成包及CMD命令来完成，虽然复杂了点，但至少编码量少了，Let’s do it!

# Hello Scaffolding Razor Page

## Step 1 : [创建Razor Page 项目](http://www.cnblogs.com/inday/p/razor-page-in-asp-net-core-2.html#autoid-1-2-0)

## Step 2 : 创建一个Model，在这里我们创建一个Blog实体类：
    
    
    public class Blog
    {
        public int BlogId { get; set; }
    
        public string Title { get; set; }
    
        public string Author { get; set; }
    
        public DateTime CreatedDate { get; set; }
    }

## Step 3 : 创建DbContext：
    
    
    public class BlogDbContext : DbContext
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
        {
        }
    
        public DbSet<Blog> Blogs { get; set; }
    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Blog>().ToTable("Blog");
        }
    }

## Step 4 : 配置连接字符串并把这个DbContext通过DI的方式注册到项目容器中
    
    
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<BlogDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("BlogDbContext")));
        services.AddMvc();
    }

## 记得在配置文件（appsettings.json）中加入connectString:
    
    
    {
      "ConnectionStrings": {
        "MovieContext": "Server=(localdb)\\mssqllocaldb;Database=DemoDb;Trusted_Connection=True;MultipleActiveResultSets=true"
      }
    }

## Step 5 : 安装CodeGeneration package,工具-Nuget包管理器-程序包管理控制台
    
    
    Install-Package Microsoft.VisualStudio.Web.CodeGeneration.Design -Version 2.0.0

## Step 6 : 添加数据迁移-更新到数据库：
    
    
    Add-Migration Initial
    Update-Database

[这里一定要做下迁移，否则生成代码会不成功，我估计生成代码会去读取数据库]

## Step 7 ： 打开终端（CMD or Powershell）

先移步到项目目录（Program.cs和Startup.cs这个目录）

我的是：E:\project\aspnet\Demos\WebApplication4\WebApplication4

然后输入以下命令：
    
    
    dotnet aspnet-codegenerator razorpage -m Blog -dc BlogDbContext  -udl -outDir Pages\Blogs –referenceScriptLibraries

ok，如果顺利你就能看到如下提示：

[![image](https://images2017.cnblogs.com/blog/4871/201709/4871-20170929114837684-1031752627.png)](http://images2017.cnblogs.com/blog/4871/201709/4871-20170929114836840-286515896.png)

我们可以看到它自动创建了相应的View和PageModel。

虽然没有MVC那么便利，但至少也节约了我们不少时间。

# Issues

## 自动生成的DbContext的DbSet名字不正确

我们看下Create.cshtml.cs代码，其中一段：
    
    
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }
    
        _context.Blog.Add(Blog);
        await _context.SaveChangesAsync();
    
        return RedirectToPage("./Index");
    }

可以看到 它使用了**Blog** 作为实体类的集合名了，但在Step 3中，我使用的是Blogs，这应该是个bug，想提交的，但没有找到相应的项目。

# 写在最后

后天就是伟大的祖国生日了，大家节日快乐！明天去HK迪士尼![Open-mouthed smile](https://images2017.cnblogs.com/blog/4871/201709/4871-20170929114838325-1158323009.png)好期待，嘿嘿。

后面我会把用Razor Page遇到的问题总结放上来，非常看好它，相信会越来越火的。

PS：asp.net core QQ学习群：376248054 通关密码：cnblogs（无密码一律不通过）

