---
title: "Do You Kown Asp.Net Core -- Asp.Net Core 2.0 未来web开发新趋势  Razor Page"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Do You Kown Asp.Net Core -- Asp.Net Core 2.0 未来web开发新趋势  Razor Page

> 原文链接: https://www.cnblogs.com/inday/p/razor-page-in-asp-net-core-2.html | 迁移自博客园

---

# Razor Page介绍

## 前言

上周期待已久的Asp.Net Core 2.0提前发布了，一下子Net圈热闹了起来，2.0带来了很多新的特性和新的功能，其中Razor Page引起我的关注，作为web程序员来说，Asp.Net下的任何web框架都会去特别关注，因为每次一个新的框架出来，意味着一次革命。此次的Razor Page是否能带来不一样的体验呢，让我们一起来看看吧。

## 什么是Razor Page

我们都知道在Asp.Net MVC中，Razor是其一种视图引擎。而今天我们介绍的Razor Page却是一种web框架，它是一种简化的MVC框架，如果你曾经做过WebForm的开发者，你会发现，Razor Page有点类似Web Form，一个page，一个class。

大家或许会有疑惑，我们现在Asp.Net MVC已经很完善了，为何还需要出来一种新型的框架呢？在我看来，MVC确实已经足够强大了，只是因为太强大了，却变成了它的缺点。当我们的业务越来越庞大的时候，你是否觉得你的一个Controller内部已经凌乱不堪？当我们业务模块划分越多的时候，你是否会为你的Model创建而头疼呢？当我们创建一个新的View的时候，我们需要在MVC层增加1个View，1个Model，修改一个Controller，每当这个时候，我都会疑惑这不是违反Open-Closed Principle（对扩展开放，对修改关闭）了嘛！这个时候我会想起以前的webform，现在不需要了，我们有了Razor Page，一种更轻量级的MVC（我觉得更像MVVM）。

# 如何创建Razor Page

我们可以通过多种方式来创建Razor Page项目，最简单的就是利用dotnet命令方式，当然我还是建议您使用Visual Studio 2017（宇宙最强的IDE）。要创建Razor Page，你需要先安装.Net Core 2.0 SDK，如果要使用VS2017来创建，您还必须要更新到15.3版本以上

## dotnet命令方式创建

打开cmd或者powershell工具，先检查下你的dotnet 版本是否为2.0.0

dotnet –version

先通过命令，到你需要创建项目的目录，我这里为E盘下demos目录：cd e:\demos\RazorPageDemo1
    
    
    dotnet new razor

输入以上命令，你就已经创建了razorPage的项目了，这里说一下dotnet 2.0默认是自动restore的，你也可以通过--no-restore选项关闭。我们直接通过命令dotnet run 可以直接运行，看到的页面应该跟之前mvc创建的类似。

输入dir，我们看下生成了哪些：

[![image](https://images2017.cnblogs.com/blog/4871/201708/4871-20170823145232027-1647571577.png)](http://images2017.cnblogs.com/blog/4871/201708/4871-20170823145231371-339315593.png)

跟之前mvc不同的是，我们不再看到model，view，controller目录了，取而代之的是Pages目录，这个就是我们的razor Page的主要工作目录。

## Visual Studio 2017创建Razor Page

用Visual Studio 2017创建是非常方便的（宇宙最强IDE），不过我们必须要先升级到15.3，升级之后选择新建项目->.Net Core –> Asp.Net Core Web应用程序，接下来会弹出一个对话框，让我们选择模板类型：

[![image](https://images2017.cnblogs.com/blog/4871/201708/4871-20170823145233386-1945533079.png)](http://images2017.cnblogs.com/blog/4871/201708/4871-20170823145232574-2064772613.png)

多了好多模板，好兴奋啊！我们在这里无法找到Razor Page，那是因为Razor Page已经变成默认的【Web应用程序模板】了，而传统的MVC方式已经变成【Web应用程序（模型视图控制器）】。选择【Web应用程序模板】，点击确定我们就完成创建了，通过Solution Explore，我们可以看到：

[![image](https://images2017.cnblogs.com/blog/4871/201708/4871-20170823145234871-90995909.png)](http://images2017.cnblogs.com/blog/4871/201708/4871-20170823145234089-1272197247.png)

与命令方式创建的一致。

# QuickStart Razor Page

## Hello Razor Page

通过上节我们创建了Razor Page项目，直接通过dotnet run或者在vs中F5运行。上文中我们说到，Razor Page的项目中，我们的关注点都在Pages目录下，在VS Explore中，我们看到在Index.cshtml的左边有一个三角箭头，点击就会看到Index.cshtml.cs文件，是不是感觉回到了webform。我们看下代码：
    
    
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
    
        }
    }

因为我们的Index页面没有绑定任何数据，所以这里基本上只继承了PageModel，OnGet方法是个约定，查看mvc的源码你会发现它会获取On{handler}{Async}()。比如OnGet，它会在Get Index的时候被执行，我们可以通过这个约定进行数据绑定，这里知道下在Razor Page下HttpMethod也是一个handler，所以Razor Page的处理方式是通过handler进行的。

举个例子，我们在IndexModel中添加一个String类型的属性Message，在OnGet中进行赋值：
    
    
    public void OnGet()
    {
        Message = "this is a test!";
    }

然后我们修改下Index.csthml：
    
    
    @page
    @model IndexModel
    @{
        ViewData["Title"] = "Home page";
    }
    
    <div class="row">
       Message : @Model.Message
    </div>

运行下，如果我们在页面上看到Message ： this is a test!，说明赋值成功。

是不是很方便，一般我们的web基本上百分之八十在Get和Post，特别情况会出现其他HttpMethod，当然我们的RazorPage也支持，不过不建议。

现在来说PageModel就是一个Model，Action，HttpMethod的合体，对于Controller使用文件自己的路径+文件名的方式，比如原先我们的HomeController，默认情况下我们可以通过’/’访问也可以通过’/Home/’ 访问，这其实有歧义的，为了避免这种情况，我们必须去修改Route，非常不方便，而现在，我们只需要在Pages主目录下创建相应的Action就可以了，微软提供了Razor Page的对应Url关系，如图：

[![image](https://images2017.cnblogs.com/blog/4871/201708/4871-20170823145236214-1974560319.png)](http://images2017.cnblogs.com/blog/4871/201708/4871-20170823145235511-1218634266.png)

## 快速自定义Routing

你是否会问现在还支持/Controller/Action/ID 吗？

支持，不过你需要在cshtml页面上，通过@page设置路由

@page "{parameter:type?}"

例如 /Address/Province/City 我们只需要在Address/Index.cshtml页面上加入如下：

@page "{Province}/{City?}"

问号代表可选参数。这样的好处就是我们不需要在RegisterRoute的时候去填写规则了，是不是很棒！![Flirt male](https://images2017.cnblogs.com/blog/4871/201708/4871-20170823180345996-296888059.png)

那像原来我们在一个Controller中，有Get()和Get(id)表示获取列表和获取单个Item，那在Razor Page中如何运用呢？

抱歉，目前我没有找到最佳的解决方法，原本我打算在@page "~/user/{id:int}"，但是测试结果发现不支持，因为我们的page对应到url也是一个目录，@page route的时候它不会识别绝对路径和相对路径，它只会在当前路径后面添加映射，也就是说我们的url变成了/users/user/{id}，目前最佳的解决方式是建立两个目录，如下：

[![image](https://images2017.cnblogs.com/blog/4871/201708/4871-20170823180346839-1546850087.png)](http://images2017.cnblogs.com/blog/4871/201708/4871-20170823180346418-1105821342.png)

## 模型绑定

在Razor Page中，数据绑定是非常简单的， 您只要在需要绑定的属性上添加[BindProperty]特性即可。
    
    
    public class IndexModel : PageModel
    {
        
        public string Message { get; set; }
    
        [BindProperty]
        public User TestUser { get; set; }
    
    }
    
    public class User
    {
        public Guid UserID { get; set; }
    
        public  string Name { get; set; }
    }

默认情况模型绑定不支持Get方法，你需要使用[BindProperty(SupportsGet=true)]

## TempData 临时数据

TempData是Asp.Net Core 2.0新增的特性，你只需要在PageModel中的属性上加上TempData特性即可。加上TempData特性的属性，会在你跳转路由或者页面的时候隐性的传递过去。

什么意思呢？比如当你创建一个用户的时候，你会希望跳转回用户列表页，并在用户列表页提示添加成功的信息，这时候你可以通过在Message属性上加上[TempData]特性，引用下微软Docs的例子：
    
    
    public class CreateDotModel : PageModel
    {
    
        [TempData]
        public string Message { get; set; }
    
    
        [BindProperty]
        public Customer Customer { get; set; }
    
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }
            //todo create a new customer
            Message = $"Customer {Customer.Name} added";
            return RedirectToPage("./Index");
        }
    }

跳转到Index后，我们的IndexModel的Message属性（需要同样设置TempData特性）就会被赋值。有点类似于之前的model传递，但又不一样，感觉棒棒哒！

## 遇到的一些问题

Q:自定义routing的时候，无法支持绝对路径和相对路径

A:应该可以通过重写某个接口达到目的，稍后我会看下

Q:不支持多个handler在同一个pageModel中，比如OnGet, OnGetAsync不能在同一个PageModel中

A：可以通过自己重写IPageHandlerMethodSelector接口，然后注册到service中应该可以解决。

Q:用VS2017创建新的Page的时候，会在页面上显示红线

A：关闭页面再打开。。。。

# 写在最后

最近工作有点忙，Core2.0的出现使Net圈沸腾了，RazorPage的出现更是让我们这种web开发者为之振奋，今天介绍的有限，毕竟也是刚出来的东西。个人觉得Razor Page还是非常棒的，虽然还有些问题，如果遇到Razor Page无法解决的事情，请大家结合MVC，国外有大神就是这么做的，但我相信不久之后，Razor Page会疯狂出现在我们面前，特别是对于微服务架构来说，简单和快速是微服务的重要所在。

最后推荐下自己的.Net Core学习群：376248054

