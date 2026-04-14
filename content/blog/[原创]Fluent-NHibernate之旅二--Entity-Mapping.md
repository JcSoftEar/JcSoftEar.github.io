---
title: "[原创]Fluent NHibernate之旅二--Entity Mapping"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [原创]Fluent NHibernate之旅二--Entity Mapping

> 原文链接: https://www.cnblogs.com/inday/archive/2009/08/22/Study-Fluent-NHibernate-Simple-Entity-Mappings.html | 迁移自博客园

---

接着上一篇，今天我们说说ORM中的Mapping。如果你要体验NHibernate的强大，首先你就要学会配置，包括SessionFactory和Mapping的配置。今天跟上一篇一样，会使用传统方式和 [NHibernate](http://fluentnhibernate.org/) 进行讲解。如果你要亲手试验一下，可以先看一下“[Fluent NHibernate之旅一](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)”，进行一下数据库和SessionFactory的准备。

# 本节内容：

  * 简单实体映射 
  * 使用自定义类型映射实体属性 



NHibernate的实体映射（Entity Mapping）做的非常好，虽然不是完美，但一些我们经常使用的，基本上已经都支持了，而且配置也相对比较简单。好了，开始我们的体验之旅吧。

# 一、简单实体映射

为了配合今后的教程，我们以一个简单的电子商务平台说起。一个B2C的电子商务，我们一定需要产品和订单，因为是示例，所以尽可能的简单，我们先设计两张表：Order 和 Product

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_77E9/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_77E9/image_2.png)

我们先写Entity Model，无论传统方式还是Fluent，都需要这个Model。
    
    
    public class Product
    {
        public virtual int ProductID { get; set; }
    
        public virtual string Name { get; set; }
    
        public virtual decimal Price { get; set; }
    
        public virtual DateTime CreateTime { get; set; }
    }
    
    public class Order
    {
        public virtual int OrderID { get; set; }
    
        public virtual decimal Price { get; set; }
    
        public virtual OrderState State { get; set; }
    
        public virtual DateTime CreateTime { get; set; }
    }
    
    public enum OrderState
    {
        Created,
        Paied,
        Consignment,
        Complete,
    }

稍微简单介绍下，订单有订单号、总价、订单状态、创建时间等属性，状态现在是int类型，过后我演示一下如何使用枚举型。产品有产品ID，产品名，价格，创建时间。今天的内容不涉及关联关系，所以我们今天暂且不说Order。

好了，接下来开始我们的代码演示阶段。

传统方式：传统方式使用xml文件进行映射，配置文件如下：
    
    
    <hibernate-mapping xmlns="urn:nhibernate-mapping-2.2" namespace="EntityModel" assembly="EntityModel">
      <class name="Product" table="Product">
        <id name="ProductID">
          <generator class="native" />
        </id>
        <property name="Name">
          <column name="Name" length="50" sql-type="varchar(50)" not-null="true" />
        </property>
        <property name="Price">
          <column name="Price" sql-type="real" not-null="true" />
        </property>
        <property name="CreateTime">
          <column name="CreateTime" sql-type="datetime" not-null="true" />
        </property>
      </class>
    </hibernate-mapping>

Order的映射大体与Product相似。

Fluent方式：或许你会觉得我们用了配置文件进行映射，相当的简单，想怎么配就可以了，但实际用下来，我还是更喜欢Fluent的映射方式，映射代码如下：
    
    
    public class ProductMap : ClassMap<Product>
    {
        public ProductMap()
        {
            Id(m => m.ProductID);
            Map(m => m.Name);
            Map(m => m.Price).ColumnName("Price");
            Map(m => m.CreateTime);
        }
    }

我们只需要继承Fluent的ClassMap<T>类，然后在构造方法中完成映射方法，就能完成传统方式的映射了。映射的方式很简单吧，相信大家都能看懂吧，为什么会如此方便呢？这其实就是完全靠了Lambda表达式，大家可以看看老赵的“[从.NET框架中委托写法的演变谈开去](http://www.cnblogs.com/JeffreyZhao/archive/2009/08/07/from-delegate-to-others-2.html)”，就非常清楚了。我们来看看Id和Map

Id(Expression<Func<T, object>> expression)：一看就很明白了，主键嘛，因为有了VS，因为有了泛型，因为有了委托，因为……，我们只需要简单的 m => m.ProductID，可能你会说主键的类型，主键还有很多特性，难道不需要配置吗？回答是当然需要，因为我们这里的属性名与表中的主键名是相同的，所以没有进行设置，如果你数据库的主键名是ID，这里我们只需要Id(m => m.ProductID).ColumnName(“ID”),你可以看到上述映射中的Price，我用了一下，其实不用也是没有关系的，只是做演示。当然还有很多，因为有了智能感知，我们只要.一下就能看到很多方法，但有一点你要注意，.ColumnName()后就不能再进行配置了，所以其他一些配置，你要放在ColumName之前。

Map(Expression<Func<T, object>> expression)：与Id类似，对应NHibernate中的property，我这里只是简单的映射，还有很多特性，在今后的教程中会慢慢使用。

两者之间的对比，只有用了以后你才能懂得，只能意传不能言语。对于我这种新手来说，Fluent更适合我，因为我可以用它来进行学习NHibernate。

映射做好了，接下来我们在NHibernate中把映射加到配置中。

传统方式：
    
    
    <mapping assembly="MyNHibernate"/>

Fluent：
    
    
    private static ISessionFactory CreateSessionFactory()
    {
        return Fluently.Configure()
           .Database(MsSqlConfiguration.MsSql2005
                .ConnectionString(s => s.Server(".")
                    .Database("MyNHibernate")
                    .TrustedConnection()))
            .Mappings(m => m.FluentMappings.AddFromAssembly(typeof(FluentSessionFactory).Assembly).ExportTo("c:\\path"))
            .BuildSessionFactory();
    }

Fluent的方式比上一篇中多了Mappings方法，Mappings的配置方式有很多，我这里用了最简单的FluentMappings.AddFromAssembly，只要添加Entity Mapping所在的程序集就可以了。当然还有更多的方法，如果大家想了解的话，可以看一下[Fluent NHibernate API Document](http://fluentnhibernate.org/)。

在这里顺带介绍一下，MappingConfiguration.ExportTo(string path) 方法，它能把你的Entity Mapping自动生成hbm.xml文件到你指定的path中，我们可以生成好hbm.xml文件，自己再看一篇，看看NHibernate的映射方式，所以是非常好的一个方法，我有时候做映射的时候，遇到问题都会生成出来，随时查看问题所在，所以说是非常有用的一个方法，而且你可以把你的映射文件直接用到NHibernate项目中去。

Product我们映射好了，我们试着测试一下吧，这一次，我们用传统方式插入数据，用Fluent方式获取数据，测试代码如下：
    
    
    [TestMethod]
    public void NHibernateFactory()
    {
        var factory = TradSessionFactory.GetCurrentFactory();
        using (ISession session = factory.OpenSession())
        {
            Product product = new Product();
            product.CreateTime = DateTime.Now;
            product.Name = "First Product";
            product.Price = 15;
    
            session.Save(product);
        }
    }
    
    [TestMethod]
    public void FluentFactory()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            Product product = session.Load<Product>(1);
            Assert.AreEqual("First Product", product.Name);
        }
    }

如果我们的映射都正确，这2个单元测应该会都通过，接下来我们看下测试结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_77E9/image_thumb_1.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_77E9/image_4.png)

正如我们预料的一样，测试通过，说明我们的映射没有出现错误。

# 二、使用自定义类型映射实体属性

NHibernate支持我们用自定义的类型来映射属性，但因为我是初学，我真的不会，当然我在网上找到了相关的资料，在此也不多说，就说说Fluent的方式吧，在我映射自定义属性的时候，也就是Map()的时候，我想看看Map还有哪些方法，结果就看到了CustomTypeIs() 和 CustomTypeIs<T>() 两个方法，一个使用反射，一个用泛型，强类型，我当然会选择后者咯。为了接下来的方便，我把Fluent的Mapping都生成到我传统方式的Mapping目录中，加入到项目，设置成嵌入的资源，一切都为了以后的教程，换句话说以后的教程中，我一般都会使用Fluent来进行映射，而传统方式作为学习之用。

在Order实体中,我们看到了订单状态我用了OrderState枚举类型,数据库存储类型为tinyint，对于它的映射，我们只需要：
    
    
    public class OrderMap : ClassMap<Order>
    {
        public OrderMap()
        {
            Id(p => p.OrderID);
            Map(p => p.Price);
            Map(p => p.State).CustomTypeIs<OrderState>();
            Map(p => p.CreateTime);
        }
    }

是啊是啊，就这么简单，懂了吧，不需要解释了吧，连我英文这么差都能看得那么明白，我相信博客园的朋友一定比我更明白了吧。传统方式的映射，我是看了生成文件，也不是很复杂，而且我觉得生成的文件比我自己写的还要标准，呵呵。顺便贴一下吧。
    
    
    <hibernate-mapping xmlns="urn:nhibernate-mapping-2.2" default-access="">
      <class name="EntityModel.Order, EntityModel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" table="`Order`" xmlns="urn:nhibernate-mapping-2.2">
        <id name="OrderID" type="Int32" column="OrderID">
          <generator class="identity" />
        </id>
        <property name="Price" type="Decimal">
          <column name="Price" />
        </property>
        <property name="State" type="EntityModel.OrderState, EntityModel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null">
          <column name="State" />
        </property>
        <property name="CreateTime" type="DateTime">
          <column name="CreateTime" />
        </property>
      </class>
    </hibernate-mapping>

[](http://11011.net/software/vspaste)

接下来还是测试，这次换Fluent方式来新增Order，传统方式来获取这个Order，代码如下：
    
    
    [TestMethod]
    public void NHibernateFactory()
    {
        var factory = TradSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            Order order = session.Load<Order>(1);
            Assert.AreEqual(OrderState.Created, order.State);
            Assert.AreEqual(200, order.Price);
        }
    }
    
    [TestMethod]
    public void FluentFactory()
    {
        var factory = FluentSessionFactory.GetCurrentFactory();
        using (var session = factory.OpenSession())
        {
            Order order = new Order()
            {
                Price = 200,
                State = OrderState.Created,
                CreateTime = DateTime.Now
            };
    
            session.Save(order);
        }
    }

[](http://11011.net/software/vspaste)

老规矩，翠花，上测试结果：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_77E9/image_thumb_2.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/FluentNHibernate_77E9/image_6.png)

不错不错，测试一切正常，今天的代码就到这里。

# 总结

今天介绍了如何映射简单的实体，但很多时候这都是理想的数据设计，还有更多复杂，不可预计的数据设计，这时候我们Fluent能做到吗？这个答案我也不知道，至少我在解决的问题的时候，觉得Fluent方式比传统方式要方便一些，至少我们测试的时候，我不需要把映射文件，配置文件等重新到复制到测试项目中了，呵呵。NHibernate是个强大的ORM框架，对他的了解我还太浅，还需要一定的时间去掌握。

前几天的开篇“[Fluent NHibernate之旅一](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)”，反响不是很好，或许大家用NHibernate的真的很少，或许我写的不够好，或许。。。。不过这不影响我需要完成这个系列的愿望，因为真的遇到了太多难以解决的问题，确实在解决中学到了很多，我很希望能把这一切与大家一起分享，至于好与坏，待大家来评价吧。

PS:终于可以上网了,憋了好久啊，哈哈

