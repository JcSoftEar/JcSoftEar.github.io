---
title: "[原创]Fluent NHibernate之旅（四）-- 关系（上）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [原创]Fluent NHibernate之旅（四）-- 关系（上）

> 原文链接: https://www.cnblogs.com/inday/archive/2009/09/08/Fluent-NHibernate-one-to-one.html | 迁移自博客园

---

经过了前面三篇的介绍,相信大家对Fluent NHibernate已经有一定的了解了,在我们学习中，[Fluent](http://fluentnhibernate.org/) 也已经进入了RTM版本。这次的版本发布离RC版只有半个月不到，修正了很多bug，同时补充了大量的功能，在每天更新中，也看到了大量的单元测试，我们相信Fluent NHibernate 已经相对稳定成熟了。RTM相对于RC版本来说，使用方法没有太大的变化，所以不做讲解。

> 我们后面的教程，会使用RTM版本来演示，希望大家能及时更新（[点击下载最新版](http://fluentnhibernate.org/downloads/releases/fluentnhibernate-1.0RTM.zip)）。

Fluent NHibernate之旅系列导航：

一、开篇：[ISessionFactory Configuration](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)

二、实体映射：[Entity Mapping](http://www.cnblogs.com/inday/archive/2009/08/22/Study-Fluent-NHibernate-Simple-Entity-Mappings.html)

三、继承映射：[Inheritence Mapping](http://www.cnblogs.com/inday/archive/2009/08/27/Fluent-NHibernate-Inheritance-Mapping.html)

今天我们将说一下ORM中的R映射，我们现在的数据库大多都是关系型数据库了，所以可以说关系在我们数据库设计中也是非常重要的部分，[NHibernate](http://fluentnhibernate.org/)也非常重视这一块，但在传统方式中，配置就比较麻烦，不是说我们Fluent能简单，只是传统方式的xml看上去不太美观，而Fluent这种代码式方式，更能符合我们Developer的习惯。

# 数据库关系

数据库关系一般有：

1、一对一

2、一对多

3、多对多

# 开始

结合我们前三个系列的示例，我们这一次加一个用户表[User]，目的就是存储用户信息所用，再加一个UserDetail，作为用户的详细信息。怎么简单怎么来，数据库设计如下：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_thumb_1.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_4.png)

够简单的吧，User和UserDetail是一对一关系，构建我们的实体类：
    
    
    public class User
    {
        public virtual int UserID { get; set; }
    
        public virtual string UserName { get; set; }
    
        public virtual string Password { get; set; }
    
        public virtual DateTime CreateTime { get; set; }
    
        public virtual UserDetail Detail { get; set; }
    }
    
    public class UserDetail
    {
        public virtual User User { get; set; }
    
        public virtual int UserID { get; set; }
    
        public virtual DateTime LastUpdated { get; set; }
    
        public virtual PersonName Name { get; set; }
    }
    
    public class PersonName
    {
        public virtual string FirstName { get; set; }
    
        public virtual string LastName { get; set; }
    }

[](http://11011.net/software/vspaste)

嘿，为什么是三个model呢，因为我发现前几个系列里，没有说一下Component Mapping，所以今天一并说了。这是我们简单的一个一对一的设计，我们先只要求实现映射，至于其他的比如延迟加载的，稍后说。先跑起来溜溜。

# 映射

[Fluent NHibernate](http://fluentnhibernate.org/) 映射代码：
    
    
    public class UserMap : ClassMap<User>
    {
        public UserMap()
        {
            Id(u => u.UserID).GeneratedBy.Identity() ;
            Map(u => u.UserName);
            Map(u => u.Password);
            Map(u => u.CreateTime);
            HasOne<UserDetail>(u => u.Detail).Cascade.All().PropertyRef("User");
        }
    }
    
    public class UserDetailMap : ClassMap<UserDetail>
    {
        public UserDetailMap()
        {
            Id(u => u.UserID).Column("UserID").GeneratedBy.Foreign("User");
            HasOne<User>(d => d.User).Cascade.All().Constrained();
            Map(u => u.LastUpdated).Nullable();
            Component<PersonName>(u => u.Name, p =>
            {
                p.Map(o => o.FirstName).Column("[First Name]");
                p.Map(o => o.LastName).Column("[Last Name]");
            });
        }
    }

代码中有几点要注意（红色标记）：因为UserDetail使用的主键ID与User的ID是一致的，所以我们要使用Foregin来获取User的ID。Foreign的用法与先前版本有一点不同，需要指定propertyName。很多关联方法都是与NHibernate很类似的，比如Cascade，Cascade.All代表的是cascade="all"，代表的是无论什么操作，都会同时操作关联对象。

映射完，我们测试一下：
    
    
    [Fact]
    public void CreateUserTest()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            DateTime createTime = DateTime.ParseExact("2009-07-08 11:00", "yyyy-MM-dd hh:ss",null);
            User user = new User()
            {
                CreateTime = createTime,
                Password = "ilovecandy",
                UserName = "james",
            };
    
            UserDetail detail = new UserDetail
            {
                Name = new PersonName { FirstName = "James", LastName = "Ying" },
                LastUpdated = createTime,
            };
    
            detail.User = user;
            user.Detail = detail;
    
            session.Save(user);
            session.Flush();
        }
    }
    
    [Fact]
    public void SelectUserTest()
    {
         var factory = FluentSessionFactory.GetCurrentFactory();
         using (var session = factory.OpenSession())
         {
             User user = session.Get<User>(1);
             Assert.Equal("James", user.Detail.Name.FirstName);
         }
    }

[](http://11011.net/software/vspaste)

> 从这篇以后，单元测试会使用Xunit，[可以点此下载](http://xunit.codeplex.com)

一个插入测试，一个查询测试，看看测试结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_5.png)

output：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_thumb_2.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_7.png)

ok，测试通过。我们的一对一简单映射也说完了，同时也完成了Component的映射，接下来说说延迟加载

# 一对一延迟加载

细心的朋友一定会发现我们的output出来的Sql语句，使用的是联合查询，但有时对我们来说，只需要User就可以了，我不需要查询UserDetail，或许你会说，使用以下方式来进行延迟加载：
    
    
    HasOne<UserDetail>(u => u.Detail).Cascade.All().LazyLoad();

虽然Fluent支持，虽然编译通过，但在创建ISessionFactory的时候，却会抛出异常，因为NHibernate不支持one-to-one的Lazy的特性，也就是说NHibernate不支持一对一的延迟加载。但是查了很多资料，说可以用：
    
    
    HasOne<UserDetail>(u => u.Detail).Cascade.All().Fetch.Select();

[](http://11011.net/software/vspaste)
    
    
    HasOne<User>(d => d.User).Cascade.All().Constrained();

进行延迟加载，但结果只是分了2条Sql语句进行的查询，并不是延迟加载，这一点可以通过Sql Server Profiler查看：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_thumb_3.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_1497A/image_9.png)

NHibernate是不支持one-to-one的延迟加载的，我也不知道为什么，但我们可以婉转的进行延迟加载，[老赵](http://www.cnblogs.com/JeffreyZhao)已经在他的文章“[NHibernate中一对一关联的延迟加载](http://www.cnblogs.com/JeffreyZhao/archive/2009/08/17/lazy-load-of-one-to-one-association-in-nhibernate.html)”中提出了解决方案，大家可以看一下。

# 总结

因为关联在数据中属于比较重要的一部分，所以准备拆分成上中下进行讲解。今天说了关联中比较简单的一对一关系，其实一对一关系并不简单，第一次接触的时候，难免会遇到各种问题，很欢迎大家能留言，大家一起讨论问题。

