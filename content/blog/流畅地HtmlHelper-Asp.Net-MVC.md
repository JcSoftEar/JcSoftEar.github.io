---
title: "流畅地HtmlHelper-Asp.Net MVC"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 流畅地HtmlHelper-Asp.Net MVC

> 原文链接: https://www.cnblogs.com/inday/archive/2009/09/17/Fluent-Asp-Net-MVC.html | 迁移自博客园

---

今天抛开 [Fluent NHibernate](http://www.cnblogs.com/inday/archive/2009/09/16/Fluent-NHibernate-One-To-Many.html) 不谈，我们来谈谈 [Asp.Net MVC](http://www.asp.net/mvc) ，在MVC的View中，我们经常会使用HtmlHelper来生成各种html代码（可能描述不太清楚看代码吧，呵呵）。

HtmlHelper原先的功能不是很多，还好有很多扩展方法，我们能用它来生成一个Input控件，比如：
    
    
    <%= Html.TextBox("UserID") %>

我们使用上面的代码能生成一个没有值的单行文本框，我们还可以使用：
    
    
    <%= Html.TextBox("UserID", Model.User.UserID, new { @class="class" })%> 

给这个文本框加值，加样式，与之对应的html代码：
    
    
    <input type="text" id="UserID" name="UserID" class="class" value="<%=Model.User.UserID %>" />

确实很方便，有了扩展方法，我们能很方便的创建各种控件，包括form，但如果你要生成很多控件呢？随便说个例子，比如你要添加一个产品，可能它会有几十个属性，意味着你要写几十个Html.TextBox(属性值) (这里可以是其他控件）,其实也没有什么，不过真的很不爽，可能我习惯了 [Fluent NHibernate](http://fluentnhibernate.org/) 的映射方式，我一直想着使用以下的方式来生成控件：
    
    
    <%= Html.TextBox<User>(u => u.UserID, Model.User.UserID, new { @class="class"}) %>

怎么样，是不是代码看上去很优美，少去了硬编码，怎么看都好看，哈哈，但是HtmlHelper没有这种扩展方法，那我们只能自己来写一个扩展。

这里不得不感谢微软提供了扩展方法这么好的方式，有了它，一切就变的简单了，先前看到有个朋友问是不是项目该升级到Framework3.5，我觉得是非常有必要的，因为有了它，代码看上去是如此的优美。

因为也是刚尝试接触MVC，看了一下它的源代码，HtmlHelper的扩展方法都在 System.Web.Mvc.Html 命名空间内，大概看了下InputExtensions的代码，大致是根据传入的类型，传入的name生成一个input控件，很简单的方法，但提供了我们很大的便利。不过这里值得注意的是，如果你的TextBox(name)中有"."的话，你的控件id会把"."替换成"_"的。

说干就干，不是很难，其实就是解析一个表达式树，取出它属性的Name就Ok了。介绍[Lambda表达式树](http://zzk.cnblogs.com/s?w=Lambda%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%A0%91)的文章很多，这里就不作介绍了。
    
    
    public static string GetMemeberName<T>(this Expression<T> expression)
    {
        MemberExpression memberExpression = null;
    
        if (expression.Body.NodeType == ExpressionType.Convert)
        {
            var body = (UnaryExpression)expression.Body;
            memberExpression = body.Operand as MemberExpression;
        }
        else if (expression.Body.NodeType == ExpressionType.MemberAccess)
        {
            memberExpression = expression.Body as MemberExpression;
        }
        else
        {
            throw new ArgumentException("expression Argument is Error");
        }
    
        return memberExpression.Member.Name;
    }

这里的MemberName就是获取这个表达式树的，有了它我们就能实现原先的设想了：
    
    
    public static string TextBox<T>(this HtmlHelper helper, Expression<Func<T, object>> expression)
    {
        return helper.TextBox<T>(expression, null);
    }
    public static string TextBox<T>(this HtmlHelper helper, Expression<Func<T, object>> expression, object value)
    {
        return helper.TextBox<T>(expression, value, null);
    }
    public static string TextBox<T>(this HtmlHelper helper, Expression<Func<T, object>> expression, object value, object htmlAttributes)
    {
        return helper.TextBox(expression.GetMemeberName(), value, htmlAttributes);
    }

ok，我们可以使用以下方式来构造一个TextBox了：
    
    
    <table>
        <tr>
            <td colspan="2">User Login</td>
        </tr>
        <tr>
            <td>User Name:</td>
            <td><%= Html.TextBox<StudyMvcApplication.Models.User>(u => u.Name) %></td>
        </tr>
        <tr>
            <td>Password</td>
            <td><%= Html.TextBox<StudyMvcApplication.Models.User>(u => u.Password) %></td>
        </tr>
    </table>

感觉看上去舒服多了，哈哈，看看效果图：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/HtmlHelperAsp.NetMVC_14DF7/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/HtmlHelperAsp.NetMVC_14DF7/image_2.png)

# 总结

现在还没有继续测试下去，实在有点忙，或许有人说有点多余，个人喜欢吧，哈哈。不过HtmlHelper还有很多扩展方法，所以还需要写很多代码，俺会一点一点去添加的。

说实在，MVC好像很多地方要使用那种硬编码，实在不爽，所以要改造一个自己适合的环境还真不容易啊。老赵最近弄了个MVCPath，要不就一起放进去？吼吼

> [本文章演示代码下载](https://files.cnblogs.com/inday/FluentMVC.rar)

