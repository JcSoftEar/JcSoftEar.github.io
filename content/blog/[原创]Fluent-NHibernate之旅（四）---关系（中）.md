---
title: "[原创]Fluent NHibernate之旅（四）-- 关系（中）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [原创]Fluent NHibernate之旅（四）-- 关系（中）

> 原文链接: https://www.cnblogs.com/inday/archive/2009/09/16/Fluent-NHibernate-One-To-Many.html | 迁移自博客园

---

接着[上一篇](http://www.cnblogs.com/inday/archive/2009/09/08/Fluent-NHibernate-one-to-one.html)，我们继续讲解ORM中的关系。在数据库设计中，我们最多打交道的，要算一对多关系了，延续我们的示例，我们来讲解一下一对多的关系。

Fluent NHibernate之旅系列导航：

一、开篇：[ISessionFactory Configuration](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)

二、实体映射：[Entity Mapping](http://www.cnblogs.com/inday/archive/2009/08/22/Study-Fluent-NHibernate-Simple-Entity-Mappings.html)

三、继承映射：[Inheritence Mapping](http://www.cnblogs.com/inday/archive/2009/08/27/Fluent-NHibernate-Inheritance-Mapping.html)

四、一对一映射：[One-to-One Mapping](http://www.cnblogs.com/inday/archive/2009/09/08/Fluent-NHibernate-one-to-one.html)

# 场景和数据库设计

延续我们的演示范例，用户和订单是非常典型的一对多范例。

1、一个用户可以拥有多个订单

2、一个订单只能拥有一个用户

对于用户来说，不需要每次都加载订单列表，反之订单可能每次都需要加载用户信息。Let's Go：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_7A63/image_thumb_2.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_7A63/image_6.png)

我们原先的订单系统太贫血了，我们进一步扩展一下，现在已经可以储存收货人的姓名和地址，还包括了发起人的UserID。

# 映射

不得不赞叹一下 [Fluent Nhibernate](http://fluentnhibernate.org/) ，有了它，我们的映射一切都变得如此简单，先来看看Model吧，用户的订单列表，对于用户来说，暂时是不需要排序的，所以我们可以使用ISet作为Order的列表。
    
    
    public class User
    {
        public virtual int UserID { get; set; }
    
        public virtual string UserName { get; set; }
    
        public virtual string Password { get; set; }
    
        public virtual DateTime CreateTime { get; set; }
    
        public virtual UserDetail Detail { get; set; }
    
        public ISet<Order> Orders { get; set; }
    }
    
    public class Order
    {
        public virtual int OrderID { get; set; }
    
        public virtual float Price { get; set; }
    
        public virtual OrderState State { get; set; }
    
        public virtual DateTime CreateTime { get; set; }
    
        public virtual User User { get; set; }
    
        public virtual string Address { get; set; }
    
        public virtual string Zip { get; set; }
    
        public virtual string Coignee { get; set; }
    }

好，我们看看Fluent如何映射吧，你会发觉，一切就是这么简单：
    
    
    public class UserMap : ClassMap<User>
    {
        public UserMap()
        {
            Id(u => u.UserID).GeneratedBy.Identity() ;
            Map(u => u.UserName);
            Map(u => u.Password);
            Map(u => u.CreateTime);
            HasOne<UserDetail>(u => u.Detail).Cascade.All().Fetch.Select();
            HasMany<Order>(u => u.Orders).AsSet().KeyColumn("UserID").Cascade.All();
        }
    }
    
    public class OrderMap : ClassMap<Order>
    {
        public OrderMap()
        {
            Id(o => o.OrderID).GeneratedBy.Identity();
            Map(o => o.Price);
            Map(o => o.State).CustomType<OrderState>();
            Map(o => o.Address);
            Map(o => o.Coignee);
            Map(o => o.CreateTime);
            Map(o => o.Zip);
            References<User>(o => o.User).Not.LazyLoad().Column("UserID");
        }
    }

怎么样，简单明了吧，比传统方式要容易懂吧，看一下我们的测试结果：
    
    
    [Fact]
    public void CreateOrder()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            User user = session.Get<User>(1);
            Order order = new Order()
            {
                Address = "James & Candy 's Home",
                Coignee = "Candy",
                CreateTime = DateTime.Now,
                Price = 1500,
                State = OrderState.Created,
                Zip = "200000",
            };
    
            order.User = user;
            session.Save(order);
        }
    }

[](http://11011.net/software/vspaste)

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_7A63/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_7A63/image_3.png)

一对多的映射，比起一对一来说还相对的简单点，默认是延迟加载，如果项目中，有些地方，需要立即加载，我们也可以使用 FetchMode.Eager 来加载。

# 立即加载
    
    
    [Fact]
    public void Test_User_Eager_Orders()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        User user;
        using (var session = factory.OpenSession())
        {
            user = session.CreateCriteria<User>()
                                .SetFetchMode("Orders", FetchMode.Eager)
                                .List<User>().FirstOrDefault();
        }
    
        Assert.NotNull(user);
        Assert.Equal(true, user.Orders.Any());
    }

这里为什么没有在using中进行测试，就是为了表示，我们立即加载了Orders属性，来看看我们的测试结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_7A63/image_thumb_1.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_7A63/image_7.png)

我们在Output中，能看到NHibernate生成的Sql语句，测试也成功，说明我们刚刚是立即加载了Orders属性。

# 总结

总体来说，一对多的映射比较简单点，不过我们今天只是说了一般的情况，但如果我们遇到级联更新、级联删除等，就会遇到一些问题，在后续文章中会慢慢道来。

如果您在使用Fluent Nhibernate的时候也遇到了问题，可以及时与我联系或求助于Fluent 的[Google Groups](http://groups.google.com/group/fluent-nhibernate)。

应“[亦续缘](http://www.cnblogs.com/xczt/)”的要求，我把代码整理了下，发上来，便于大家学习。

> [点击下载源代码](https://files.cnblogs.com/inday/MyNHibernate.rar)

