---
title: "[原创]Fluent NHibernate之旅"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [原创]Fluent NHibernate之旅

> 原文链接: https://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html | 迁移自博客园

---

ORM大家都非常熟悉了吧，我相信也有很多朋友正在用自己或者一些公开的框架，而最常用而且强大的，非Hibernate了（Net中为[NHibernate](http://fluentnhibernate.org/)）,网上的文档非常多，不过在博客园中，介绍NHibernate的非常少，李哥的NHibernate系列（[NHibernate之旅](http://www.cnblogs.com/lyj/archive/2008/10/30/1323099.html)）不失为一个经典，对于新手的我们，需要完全掌握还需要很长一段路，对于新手来说，最初的配置是非常头大的一件事情，好在[老赵](http://www.cnblogs.com/JeffreyZhao)推荐一个开源的框架[Fluent NHibernate](http://fluentnhibernate.org/)，有了它，我们可以完全脱离配置文件，不过博客园中介绍Fluent NHibernate的文章非常少，而且官方文档也还没有完全，所以对于我来说也就一点一点摸索起来，这也激起了我写这个笔记的欲望，废话不说了，下面就介绍Fluent NHibernate，大家也一起来体验一下Fluent Nhibernate的快感吧。

本篇内容：

1、初识Fluent NHibernate（简称Fluent）

2、使用NHibernate和Fluent创建ISessionFactory

3、传统方式和Fluent的对比。

4、灵活的Fluent

一、初识Fluent NHibernate（简称Fluent）

> Fluent NHibernate offers an alternative to NHibernate's standard XML mapping files. Rather than writing XML documents (.hbm.xml files), Fluent NHibernate lets you write mappings in strongly typed C# code. This allows for easy refactoring, improved readability and more concise code.

这是官方的说明，大体的话也就是用编程的方式进行配置，让你能更好的理解，不需要编写复杂的映射文件，它能完全替换NHibernate的映射文件，让你在映射的时候能使用C#的强类型方式。

在开始之前，我们先下载它的Dll，当然你也可以下载它的源代码进行修改和学习。

下载地址：<http://fluentnhibernate.org/>

二、使用NHibernate和Fluent创建ISessionFactory

准备工作：

> 1、下载Fluent类库，其中已经包含了NHibernate最新版本。
> 
> 2、下载NHibernate类库，虽然Fluent已经有了最新版本，但我们还需要Proxy的Dll，这里我们使用NHibernate.ByteCode.Castle这个程序集。
> 
> 3、建立一个空数据库（我们使用MSSql2005），数据库名为：MyNHibernate，这个数据库为信任连接。

在NHibernate中，ISession是操作数据的核心，我们需要通过SessionFactory来建造ISession来进行数据的交互。SessionFactory中反映了数据库映射关系，我们来看下配置：

  
  


<hibernate-configuration xmlns="urn:nhibernate-configuration-2.2">  
<session-factory>  
<property name="dialect">NHibernate.Dialect.MsSql2005Dialect</property>  
<property name="connection.connection_string">  
Server=(local);initial catalog=MyNHibernate;Integrated Security=SSPI  
</property>  
<property name="connection.isolation">ReadCommitted</property>  
<property name="proxyfactory.factory_class">  
NHibernate.ByteCode.Castle.ProxyFactoryFactory, NHibernate.ByteCode.Castle  
</property>  
</session-factory>  
</hibernate-configuration>

大体的意思我相信大家都懂，数据库类型和数据库的配置，还有一些NHibernate所需的配置，这里的proxyfactory.factory_class是2.1新加入的，至于用处还不是很了解，大家可以看下李大哥的“[NHibernate2.1新特性之Tuplizers](http://www.cnblogs.com/lyj/archive/2009/08/02/nhibernate-new-features-tuplizers.html)”。下面我们在代码中创建一个SessionFactory，NHibernate建议我们在一个应用程序中使用一个数据库一个SessionFactory，这里我们用单数据库，代码如下： 
    
    
     1![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)        public static ISessionFactory GetCurrentFactory()  
     2![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)        ![](https://www.cnblogs.com/Images/dot.gif){  
     3![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            if (sessionFactory == null)  
     4![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif)            ![](https://www.cnblogs.com/Images/dot.gif){  
     5![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                sessionFactory = CreateSessionFactory();  
     6![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif)            }  
     7![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
     8![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            return sessionFactory;  
     9![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)        }  
    10![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
    11![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)        private static ISessionFactory CreateSessionFactory()  
    12![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)        ![](https://www.cnblogs.com/Images/dot.gif){  
    13![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            return new Configuration().Configure().BuildSessionFactory();  
    14![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)        }  
    15![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
    16![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)        private static ISessionFactory sessionFactory  
    17![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)        ![](https://www.cnblogs.com/Images/dot.gif){  
    18![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            get;  
    19![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            set;  
    20![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)        }
    
              
    传统的方式其实已经非常灵活和简单了，但配置文件真的有点头大，那么多的属性，还有很多特性（Attribute），接下来我们来看下Fluent

使用Fluent我们不需要再进行配置，我们可以完全抛开xml文档，前面说过Fluent是对Mapping的一个代码化，Mapping的一切功能，我们都能通过Fluent进行配置。

因为Fluent是基于NHibernate的，它只实现了NHibernate的Mapping功能，其他功能还不能代替，所以我们的项目中要同时引入NHibernate和FluentNHibernate两个类库。代码如下：
    
    
     1![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)        public static ISessionFactory GetCurrentFactory()  
     2![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)        ![](https://www.cnblogs.com/Images/dot.gif){  
     3![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            if (sessionFactory == null)  
     4![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif)            ![](https://www.cnblogs.com/Images/dot.gif){  
     5![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                sessionFactory = CreateSessionFactory();  
     6![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif)            }  
     7![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
     8![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            return sessionFactory;  
     9![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)        }  
    10![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
    11![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)        private static ISessionFactory CreateSessionFactory()  
    12![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)        ![](https://www.cnblogs.com/Images/dot.gif){  
    13![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            return Fluently.Configure()  
    14![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                .Database(  
    15![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                    FluentNHibernate.Cfg.Db.MsSqlConfiguration.MsSql2005  
    16![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                        .ConnectionString(s => s.Server(".")  
    17![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                                .Database("MyNHibernate")  
    18![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                                .TrustedConnection())  
    19![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)                ).BuildSessionFactory();  
    20![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)        }  
    21![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)              private static ISessionFactory sessionFactory  
    22![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)        ![](https://www.cnblogs.com/Images/dot.gif){  
    23![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            get;  
    24![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)            set;  
    25![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)        }
    
              
    这样就可以了，我们完全抛开了配置，简单的一些代码，已经完成了SessionFactory的配置工作，或许你还有一些配置，在后面的文章中会继续为您讲解。

两种方式的创建写好了，因为是测试，所以写的比较乱，下面我们写一个测试代码，只需要测试一个方法即可。代码如下：

  


1![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)[TestMethod]  
2![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)public void NHibernateFactory()  
3![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/dot.gif){  
4![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) var factory = TradSessionFactory.GetCurrentFactory();  
5![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)}  
6![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)[TestMethod]  
7![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)public void FluentFactory()  
8![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/dot.gif){  
9![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) var factory = FluentSessionFactory.GetCurrentFactory();  
10![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)}  
11![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)

运行一下，结果如下：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/ORMFluentNHibernate_13C4D/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/ORMFluentNHibernate_13C4D/image_2.png)

如果数据库配置是正确的话，你会看到如上的结果。

三、传统方式和Fluent的对比

上面的演示相信大家都能看明白，两者之间的对比也比较明显的显露出来，传统的方式我们只需要编写正确的配置文件，相对比较灵活，一些修改的话都可以在配置文件中进行更新，比如Mappings，而上面的代码，Fluent虽然使用代码的方式进行了配置，省去了配置文件，但灵活性却没有传统方式那么好，修改一些配置的时候，我们得扩充我们的CreateSessionFactory的方法，不过Fluent更符合人类的思考行为，而且有VS这么强大IDE，在编写代码的同时，能够享受强大的智能感知。

两者之间都各有长短，或许你还没有体会到Fluent的强大，在日后的Mappings时，你会慢慢了解为什么他会叫Fluent。传统方式对于一些经常使用的程序员来说非常简便，加上代码生成工具，使用起来也会游刃有余，但对于新手来说，Fluent绝对是一个好帮手。

四、灵活的Fluent

那我们Fluent就没有办法灵活了吗？当然不，Fluent的开发者不仅帮你保留了原有的方式，还可以混合你的配置文件，最有意思的时，你还可以使用它来学习NHibernate，甚至可以使用它来开发你自己的自动代码生成工具，因为我也刚学，先介绍一些简单的，至于其他功能，希望大家也能跟我一起学习，体验Fluent带来的快感。

> 使用NHibernate的配置
> 
> 也就是你可以按照原先的方式进行配置，而读取呢使用Fluent来读取，然后创建SessionFactory，或许你感觉这不是多余了嘛，那是因为还没有讲到Mapping，这里我们先介绍一下，如果用Fluent结合传统的配置文件，来创建SessionFactory（后面的代码会简略，只修改上面其中的创建方法）。
>     
>     
>     private static ISessionFactory CreateSessionFactory()
>     {
>         return Fluently.Configure(new NHibernate.Cfg.Configuration().Configure()).BuildSessionFactory();
>     }
>     
>     
>     哈哈，简单吧，我们使用了原先的配置文件，然后用Fluent进行创建，而且我们可以为配置文件中没有的配置进行扩展。
    
    
    原本打算把Fluent学习的方法说一下，后来一看，必须要先说Fluent的Mapping才能说到这个，所以暂时先不说了，等到下一章映射的部分再一起来说。
    
    
    文章写得很烂，也当是笔记吧，NHibernate也是刚刚学，惭愧惭愧，学的不是很彻底，今后也会结合NHibernate的学习一起来说。

