---
title: "[原创]Fluent NHibernate之旅（四）-- 关系（下）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [原创]Fluent NHibernate之旅（四）-- 关系（下）

> 原文链接: https://www.cnblogs.com/inday/archive/2009/09/30/Fluent-NHibernate-Many-To-Many-Mapping.html | 迁移自博客园

---

最近一直忙着准备去旅行的东东，所以进度慢下来了，明天就要出发了，嘿嘿，在出发前，把多对多给写完吧。如果你第一次看这个系列，可以先看看先前几篇，了解下。

一、开篇：[ISessionFactory Configuration](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)

二、实体映射：[Entity Mapping](http://www.cnblogs.com/inday/archive/2009/08/22/Study-Fluent-NHibernate-Simple-Entity-Mappings.html)

三、继承映射：[Inheritence Mapping](http://www.cnblogs.com/inday/archive/2009/08/27/Fluent-NHibernate-Inheritance-Mapping.html)

四、一对一映射：[One-to-One Mapping](http://www.cnblogs.com/inday/archive/2009/09/08/Fluent-NHibernate-one-to-one.html)

五、一对多映射：[One-to-Many Mapping](http://www.cnblogs.com/inday/archive/2009/09/16/Fluent-NHibernate-One-To-Many.html)

# 场景和数据库设计

前两篇我们介绍了“[一对一](http://www.cnblogs.com/inday/archive/2009/09/08/Fluent-NHibernate-one-to-one.html)”和“[一对多](http://www.cnblogs.com/inday/archive/2009/09/16/Fluent-NHibernate-One-To-Many.html)（多对一）”，或许前两种用的比较多，但多对多的关系，有时候我们也会遇到，比如我们一直演示的电子商务站，我们的订单和产品的关系，就是一个非常典型的“多对多”。看看我们的数据库设计：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_8F2D/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_8F2D/image_2.png)

这里说一下，订单对于产品来说，不一定需要知道，也或者可以不需要一起加载，所以可以用延迟加载或者不加载，而产品对于订单来说，应该是需要立即加载，从而知道订单中所有的商品。随着扩展，我们必须给我们的Product和Order加入相关的属性：
    
    
    public abstract class Product
    {
        public virtual int ProductID { get; set; }
    
        private ISet<Order> m_orders = null;
        public ISet<Order> Orders
        {
            get
            {
                if (this.m_orders == null)
                {
                    this.m_orders = new HashedSet<Order>();
                }
                return this.m_orders;
            }
            set
            {
                this.m_orders = value;
            }
        }
    
        //product other Property
    }
    
    public class Order
    {
        public Order()
        {
            this.Products = new HashedSet<Product>();
        }
    
        public virtual int OrderID { get; set; }
    
        public ISet<Product> Products { get; set; }
    
        //order other Property
    }

# 映射

如果大家先前几篇都看过的话，我觉得应该没有任何问题了，因为[Fluent NHibernate](http://fluentnhibernate.org) 真的很简单，很流畅，代码如下：
    
    
    public class ProductMap : ClassMap<Product>
    {
        public ProductMap()
        {
            Id(p => p.ProductID);
            HasManyToMany<Order>(p => p.Orders)
                .AsSet()
                .LazyLoad()
                .ParentKeyColumn("ProductID")
                .ChildKeyColumn("OrderID")
                .Table("OrderProduct");
    
            Map(p => p.CreateTime);
            Map(p => p.Name);
            Map(p => p.Price);
        }
    }
    
    public class OrderMap : ClassMap<Order>
    {
        public OrderMap()
        {
            Id(o => o.OrderID).GeneratedBy.Identity();
            HasManyToMany<Product>(o => o.Products)
                .AsSet()
                .Not.LazyLoad()
                .Cascade.All()
                .ParentKeyColumn("OrderID")
                .ChildKeyColumn("ProductID")
                .Table("OrderProduct");
    
            Map(o => o.Price);
            Map(o => o.State).CustomType<OrderState>();
            Map(o => o.Address);
            Map(o => o.Coignee);
            Map(o => o.CreateTime);
            Map(o => o.Zip);
            References<User>(o => o.User).Not.LazyLoad().Column("UserID");
        }
    }

这里我们用了一个单独的一个表来保存这个多对多关系，所以需要Table("Table Name")。

ParentKeyColumn和ChildKeyColumn都是相对于自己的，大家也可以生成hbm来看下多对多的传统的写法。

# 测试

映射完成了，我们测试一下，我们还是使用[xunit](http://www.codeplex.com/xunit)来单元测：
    
    
    [Fact]
    public void CreateOrder()
    {
        using(var session = this.SessionFactory.OpenSession())
        {
            session.Transaction.Begin();
            var products = session.CreateCriteria<Product>().List<Product>();
            var user = session.Load<User>(1);
            var order = new Order
            {
                User = user,
                Address = "Shang Hai",
                Coignee = "Candy",
                State = OrderState.Created,
                CreateTime = DateTime.Now,
                Zip = "200336"
            };
    
            order.Products.AddAll(products);
            order.Price = order.Products.Sum(p => p.Price);
    
            session.Save(order);
            session.Transaction.Commit();
        }
    }

（测试代码不是很完全，在文章结尾会有源代码，大家可以下载进行学习。）

ok，我们来看下我们的测试结果，我们需要：绿

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_8F2D/image_thumb_1.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_8F2D/image_4.png)

哈哈，好多Sql语句，不错不错。

# 总结

拖了那么久，也算把关系给说完了，后面还有一些文章，要等旅游回来了，吼吼。

不过现在基本上，我们可以构建一般的BS项目了，没想到写着写着，就构建了一个初级的电子商务网站，嘿嘿。

> 下载地址：[点此下载源代码](https://files.cnblogs.com/inday/MyFluentNHibernate.rar)

PS：给我一盏阿拉丁神油吧，让我消除风暴。。。。。

PS2：貌似不是很多人喜欢，或许文笔不太好，继续锻炼中。如果有不好的，大家可以联系我。

