---
title: "[原创]Fluent NHibernate之旅（三）-- 继承"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [原创]Fluent NHibernate之旅（三）-- 继承

> 原文链接: https://www.cnblogs.com/inday/archive/2009/08/27/Fluent-NHibernate-Inheritance-Mapping.html | 迁移自博客园

---

经过了“[开篇](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)”和“[简单映射](http://www.cnblogs.com/inday/archive/2009/08/15/Study-Fluent-NHibernate-Simple-Entity-Mappings.html)”两篇文章，相信大家对[](http://fluentnhibernate.org/)[Fluent NHibernate](http://fluentnhibernate.org/) 有了一定的了解了，FluentNHibernate实际就是对 [NHibernate](http://fluentnhibernate.org/) 映射的一定扩展，我们能完全利用强类型、泛型、Lambde表达式等等Vs、Framework等特性简单完成映射工作，同时也能让我们学习NHibernate的映射方式，一举夺得，这么好玩的东东，有理由不继续完成这个系列吗？废话不说，回到正题。

> 从这一篇开始，我们将使用Fluent NHibernate RC 1.0 版来进行演示，先前的代码，我会另外进行说明

# 继承

在OOP中，继承作为OO中重要的特性，如果NHibernate没有对它的支持，那怎么能称为完整的ORM框架呢？那怎么通过数据库设计来完成继承呢？常见的方法有三种，今天我们就一一来进行叙述。继承的概念我就不说了，如果你连继承还不知道的话，可以好好学起，从头学起，呵呵。

  * Table per class hierarchy(所有子类在一张表)
  * Table per subclass(父类一张表，每个子类一张表)
  * Other(其他方式)



# 准备

我们还是以前两篇的电子商务来说事，我们产品不可能只有一种，但他们有相同的属性，每种产品类型又有自己的属性拿它来事是最好的例子了。产品的相同属性，可以参考上一篇。好，我们假设我们的产品还有书和手机，他们有各自自己的属性，我们就简单加一点属性，书有作者，手机有品牌和型号，我们写这2个Entity Model：
    
    
    public class MobileProduct : Product
    {
        public virtual string Brand { get; set; }
    
        public virtual string Number { get; set; }
    }
    
    public class BookProduct : Product
    {
        public virtual string Author { get; set; }
    }

# Table per class hierarchy

这种方式在我们学习NHibernate中，一定看到过了，其实就是把父类、子类的所有属性放到一个表中，这样做的好处就是我们不需要建立其他表，一张表格全搞定，但缺点也显而易见，在属性少的情况下或许没有什么，但是多了以后，我们的维护、扩展就变得相对麻烦，而且会产生很多亢余字段，而且我们必须再添加一个标识符，来区分。

因为需要标识符，所以我们必须添加一个标识符，我这里使用枚举类型来表示，代码改变成如下：
    
    
    public enum ProductType
    {
        Mobile,
        Book
    }
    
    public abstract class Product
    {
        //…  
        public abstract ProductType Type { get; }
    }
    
    public class MobileProduct : Product
    {
        //…
        public override ProductType Type
        {
            get { return ProductType.Mobile; }
        }
    }
    
    public class BookProduct : Product
    {
        //…
        public override ProductType Type
        {
            get { return ProductType.Book; }
        }
    }

[](http://11011.net/software/vspaste)

数据库的设计，大家需要注意，子类的几个字段，最好设置成null，避免造成不能insert的问题。我们还需要增加一个标识符字段，我使用的是tinyint,如图：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image1_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image1.png)

Fluent 映射如下：
    
    
    public class ProductMap : ClassMap<Product>
    {
        public ProductMap()
        {
            Id(p => p.ProductID);
            Map(p => p.CreateTime);
            Map(p => p.Name);
            Map(p => p.Price);
            DiscriminateSubClassesOnColumn<ProductType>("Type", ProductType.Book);
        }
    }
    
    public class BookMap : SubclassMap<BookProduct>
    {
        public BookMap()
        {
            DiscriminatorValue("1");
            Map(p => p.Author);
        }
    }
    
    public class MobileMap : SubclassMap<MobileProduct>
    {
        public MobileMap()
        {
            DiscriminatorValue("0");
            Map(p => p.Brand);
            Map(p => p.Number);
        }
    }

[](http://11011.net/software/vspaste)

在RC版本之前，我们可以使用
    
    
    DiscriminateSubClassesOnColumn<ProductType>("Type", ProductType.Book)
                    .SubClass<BookProduct>(b =>
                    {
                        b.Map(p => p.Author);
                    });

[](http://11011.net/software/vspaste)[](http://11011.net/software/vspaste)

但是RC版本已经不建议我们这样使用，好的做法是把子类映射区分开来，等一下你会知道，第一种策略和第二种策略都会采用这样的方式来进行映射，至于映射会使用subclass还好是join-subclass，FluentNHibernate会自动生成的。

在说一下DiscriminateSubClassesOnColumn，这就是标识符的一个映射方式，因为在RC版之前，我们可以使用SetAttribate的方法，设定我们的父类为"not-null" 但是在RC版中，这个方法已经彻底被抛弃掉了，我们不得不使用上面的方法，给定一个默认的标识符。在子类中，我们必须制定对应的标识符值，这里又出现败笔了，只能设定string类型，My God，变相的SetAttribute，我觉得这个已经脱离了Fluent的称号了（在[RC升级介绍](http://www.cnblogs.com/inday/archive/2009/08/24/Fluent-NHibernate-RC-1-0-Notes.html)中已经说明）。

PS:刚看了下最新的FNT，已经修正了这个bug，现在已经改为：DiscriminatorValue(object value)，[详细点击](http://code.google.com/p/fluent-nhibernate/issues/detail?id=240&q=discriminator)

我们来看下测试代码：
    
    
    [TestMethod]
    public void FluentCreateData()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            Product nokia = new MobileProduct()
            {
                Brand = "Nokia",
                Number = "N91",
                CreateTime = DateTime.Now,
                Price = 5600,
                Name = "Nokia N91 Mobile"
            };
    
            session.Save(nokia);
    
            Product book = new BookProduct()
            {
                Author = "六六",
                CreateTime = DateTime.Now,
                Price = 20,
                Name = "蜗居"
            };
    
            session.Save(book);
        }
    }
    
    [TestMethod]
    public void FluentSeleteData()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            var product = session.CreateCriteria<BookProduct>().List<BookProduct>().FirstOrDefault();
    
            Assert.AreEqual("蜗居", product.Name);
            Assert.AreEqual(20, product.Price);
        }
    }

[](http://11011.net/software/vspaste)

测试结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image_thumb_2.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image_6.png)

# Table per subclass

在这种方式中，一个父类表包括了一些共同的属性，子类表除了主键外，就只有属于自己的属性。这种方式表结构清晰，而且不会有亢余字段，同时方便扩展，是不错的选择，不过这不是说其他方式没有用，要看你的使用场景。看表结构：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image_4.png)

这里注意的是，子表的主键不是递增的（废话，呵呵）。

上Mapping：
    
    
    public class ProductMap : ClassMap<Product>
    {
        public ProductMap()
        {
            Id(p => p.ProductID);
            Map(p => p.CreateTime);
            Map(p => p.Name);
            Map(p => p.Price);
        }
    }
    
    public class BookMap : SubclassMap<BookProduct>
    {
        public BookMap()
        {
            Table("Book");
            KeyColumn("ProductID");
            Map(p => p.Author);
        }
    }
    
    public class MobileMap : SubclassMap<MobileProduct>
    {
        public MobileMap()
        {
            Table("Mobile");
            KeyColumn("ProductID");
            Map(p => p.Brand);
            Map(p => p.Number);
        }
    }

怎么样，跟第一种方式是不是类似啊，呵呵，这要感谢这次的升级，我们无需改动太大，就能在这2中方式之间切换，很便利吧，至于不足，可能就是KeyColum不会自动去识别，有点遗憾，如果没有指定的话，默认为："Product_ID"。

我们的测试代码，同第一种方式，直接看测试结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image_thumb_1.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_14507/image_8.png)

# 其他方式

Table per concrete class（每个子类一张表），这种方式应该使用union-subclass标签，但FNT不支持这种方式，为什么呢，呵呵，因为这种方式不好，无论是从结构还是编写上来说，都是不好的做法，尽量避免的做法，所以FNT索性不支持了，如果真的需要这种方式，那你就直接分开映射ClassMap<T>吧，联合查询的话，或许就比较复杂了。

还有几种混合方式，其实就是第一种和第二种的结合，这要看不同需求了，同时也可以结合上面两种映射方式完成，就不做介绍了。

# 总结

这次说了一下继承的映射方式，其实很早就写好了，正好遇到Fluent NHibernate发布了RC版，所以用了一些时间去学习了下，总的来说，这次升级呢非常好，可能会存在更多的bug，但不影响我们的正常使用，而且现在的更新也非常快，后面几张可能说下几种不常见的映射和会遇到的些麻烦，不过感觉园子里使用NHibernate的人不太多，关注度不多，不过不影响我继续写下去的决心，这次也很偶然接触了FNT，确实有好多好的地方可以借鉴一下，而且在系列中，基本上每个范例都写了测试代码，虽然丑陋了点，但从小做起嘛，以后要养成这个习惯。

