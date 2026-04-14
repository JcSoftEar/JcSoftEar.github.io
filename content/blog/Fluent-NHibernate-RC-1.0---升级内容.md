---
title: "Fluent NHibernate RC 1.0 --升级内容"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Fluent NHibernate RC 1.0 --升级内容

> 原文链接: https://www.cnblogs.com/inday/archive/2009/08/24/Fluent-NHibernate-RC-1-0-Notes.html | 迁移自博客园

---

[Fluent NHiberante](http://fluentnhibernate.org/)(FNT) RC 1.0 已经在上个星期发布了，其中很多东西被废弃，有些方法改进，还有一些命名更贴切，虽说不是很完美，但已经做的非常完善了，如果大家在使用中，发现bug或者没有找到相应的方法，大家可以去 [Fluent GoogleGroups](http://groups.google.com/group/fluent-nhibernate?pli=1) 发贴，FNT的作者[James Gregory](http://blog.jagregory.com/)及时回复的。

Fluent NHibernate Release Notes 1.0 : <http://wiki.fluentnhibernate.org/Release_notes_1.0>

FNT在映射的时候，分为Fluent Mapping（手动）和Auto Mapping（自动）两种方式，我在我的“[Fluent系列](http://www.cnblogs.com/inday/archive/2009/08/04/Study-Fluent-NHibernate-Start.html)”中一直使用的是手动方式，我觉得相对应的好控制，而且也让我同时能更好的学习[NHibernate](http://nhforge.org/)。

# Fluent Mapping

1、修改一些方法名：把一些繁琐的方法名改的相对的简单而不失其含义。

WithLengthOf -> Length

ColumnName -> Column

WithTableName -> Table

其实还有很多吧，我相信大家还是能一眼看出来的，如果你没有找到的话，你可以去[GoogleGroups](http://groups.google.com/group/fluent-nhibernate?pli=1)求助一下。

2、丢弃了SetAttribute方法：因为前几个版本的FNT还不够完善，很多NHibernate的Attribute都没有提供支持，所以作者留了这一个方法，以便开发者自定义一些attribute。这一次他们完全丢弃了SetAttribute方法，完全依赖Fluent的方式来进行[实体映射](http://www.cnblogs.com/inday/archive/2009/08/22/Study-Fluent-NHibernate-Simple-Entity-Mappings.html)，所以很多特性我也不知道如何来映射，不过这时候你还是可以区[GoogleGroups](http://groups.google.com/group/fluent-nhibernate?pli=1)求助一下，强烈建议大家把它收藏一下吧，方便自己开发。

3、分开SubClass映射：在RC版以前，不管是SubClass还是JoinSubClass，我们都只需要映射在父类中就可以了，但这一做法在RC版中已经不再提倡，我们要分开映射，我相信这个做法是好的，至少能够非常清晰我们自己的映射，不会再像以前看上去不美观了，呵呵。

RC版中，SubClass和JoinSubClass的映射，都要继承SubclassMap<T>，很多属性和方法都跟ClassMap<T>一样，它有自己的一些属性和方法，比如DiscriminatorValue(string value)方法，这个方法很奇妙，如果有这个方法的话，它会映射成SubClass标签，如果没有，则会映射成Join-SubClass标签。

之前：
    
    
    public class PersonMap : ClassMap<Person>
    {
    public PersonMap()
    {
    //Mapping Person Property
    DiscriminateSubClassesOnColumn<Man>("Type")
    .SubClass<Man>(Person.Man, s =>
    {
    //Mapping Man Property
    }).SubClass<Woman>(Person.Woman, s =>
    {
    //Mapping Woman Property
    });
    SetAttribute("discriminator-value", "not null");
    }
    }

RC版：
    
    
    public class PersonMap : ClassMap<Person>
    {
    public PersonMap()
    {
    //Mapping Person Property
    DiscriminateSubClassesOnColumn<Man>("Type", Person.Man)
    }
    }
    public class ManMap : SubclassMap<Man>
    {
    public ManMap()
    {
    DiscriminatorValue("0");
    //Mapping Man Property
    }
    }
    public class WomanMap : SubclassMap<Woman>
    {
    public WomanMap()
    {
    DiscriminatorValue("0");
    //Mapping Woman Property
    }
    }

或许你一开始不太愿意接受这个写法，我一开始就是，但是我后来我慢慢发觉，这样的好处不仅在扩展时，而且在维护、阅读时都比原先的方式要好，你不觉得吗？不过还有不完美的，DiscriminatorValue(string value)这个方法，如果我们的标识符是字符串类型，那还好，但像我这种枚举类型的，不得不硬编码了。

# Auto Mapping

1、重命名静态切入点：

AutoPersistenceModel.MapEntitiesFromAssemblyOf<T>

->

AutoMap.AssemblyOf<T>

我感觉重新命名后，更让我理解了，呵呵。因为我没有用过AutoMapping，也只能简单说说了。

2、组件映射：

AutoMap.AssemblyOf<Person>().Where(type => type.Namespace.EndsWith("Domain");

->

.Setup(s => s.IsComponentType = type => type == typeof(Address))

能看懂什么意思，不过没尝试过，不评论，大家有兴趣，可以看[详细介绍](http://wiki.fluentnhibernate.org/Auto_mapping#Components)。

3、忽略属性（IgnoreProperty），这个不错，在以前，我们自动映射的时候每个属性不管要不要都映射了，在RC版，我们可以使用如下代码，忽略这些属性不进行映射，非常不错，赞一个。代码：
    
    
    .ForTypesThatDeriveFrom<Shelf>(map =>
    {
    map.IgnoreProperty(x => x.YourProperty);
    });

[](http://11011.net/software/vspaste)

还有一些，大家可以看[详细介绍](http://wiki.fluentnhibernate.org/Auto_mapping#Ignoring_properties)。

# 总结

其实还有一些内容，不过我英文不太好，不太懂，大概就是一些如果创建约束，创建规则等等，呵呵，我不太会，等大家帮忙了。

这次RC版本，有很多亮点，不过就是文档不是很全，大家可以去GoogleGroups去求助，也可以自己找一下[http://wiki.fluentnhibernate.org](http://wiki.fluentnhibernate.org/) ，总体来说，变得越来越人性化了，不过还有很多不足，相信会在下一个版本中解决一些问题的，继续关注中。。。。

