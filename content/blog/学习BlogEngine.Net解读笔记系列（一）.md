---
title: "学习BlogEngine.Net解读笔记系列（一）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 学习BlogEngine.Net解读笔记系列（一）

> 原文链接: https://www.cnblogs.com/inday/archive/2008/12/17/BlogEngineNet1.html | 迁移自博客园

---

大家好，第一次认真的去解读一个开源作品，或许有很多不对的地方，请大家及时提醒，以便我及时修改，不要越错越多：）

大家或许很早就研究过BlogEngine.Net，不过我还是刚刚接触，先前看到博客园的大大说过，BlogEngine.Net是学习Net 2.0最好的开源代码，果不其然，刚看了一个下午，我就迫不及待的想把我的学习体验记录下来，因为实在很好很强大。其实我跟很多人一样，对英文的理解很差，要我看很长的英文书，真的很困难，但代码是共通的，我们可以看国外大师的作品，看他们的代码来学习，这样比看一本英文书来的更实际吧~~~~不过还是建议大家学习好英文：）

一、Web.config

1、 数据库链接和选择方式：

<BlogEngine>

<blogProvider defaultProvider="XmlBlogProvider">

<providers>

<add name="XmlBlogProvider" type="BlogEngine.Core.Providers.XmlBlogProvider, BlogEngine.Core"/>

<add name="MSSQLBlogProvider" type="BlogEngine.Core.Providers.MSSQLBlogProvider, BlogEngine.Core"/>

</providers>

</blogProvider>

</BlogEngine>

在configuration标签内添加BlogEngine标签，子标签说明：

blogProvider：设定默认数据库选择 defaultProvider

XmlBlogProvider:xml作为数据源

MSSQLBlogProvider:Ms Sql作为数据源

Providers：标签内设定数据操作方式的命名空间和类名，可以改为access，自己添加即可

数据源为MSSQL或者其他需链接的数据源时，需要在connectionStrings内添加一个变量，变量名为：BlogEngine

二、 页面解读：

1、 基本页面BlogBasePage.cs

BlogEngine所有页面都会继承此类，主要的功能是调用模块（Theme）。

作者注释：All pages in the custom themes as well as pre-defined pages in the root

must inherit from this class.

BlogBasePage.cs会在OnPreInit 和 OnLoad 事件中，加载Theme，然后添加head头内容，更好的为搜索引擎服务。

在OnPreInit事件中，会判断是否是删除帖子的操作，如果是，则删除帖子然后返回到首页。

在OnLoad事件中，你可以自己添加一些内容，或者添加一个公用的js，当然你也可以在模板页面添加。

BlogBasePage.cs重写了OnError方法，把所有的错误都归为404错误。。。。

BlogBasePage.cs还重写了Render方法，主要是对Url重写的Form Action给予定位，以便能提交到正确的页面。具体可以查看RewriteFormHtmlTextWriter类

Translate方法使你能快速便捷的提取Resource资源，BlogEngine已经包含了很多语言资源，大家也可以按照自己的解释来翻译：P

2、 大家可以看到在代码中，很多地方出现了BlogSettings.Instance，这个是blog设置的一个公共类，这里的代码很实用，我们来看下。Instance是BlogSettings类的一个公共静态属性，主要的作用是返回一个BlogSettings的实例，微软之前就建议大家，把一些公共的设置都压入到内存中，以便更快更有效的提取。BlogSettings是个配置类，通过几个方法，把博客的配置从数据库或者xml中提取出来，然后用一个私有静态字段给予赋值，它的好处不言而喻，大家可以看一下这里的精华代码。

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Instance  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)public static BlogSettings Instance  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) get  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) if (blogSettingsSingleton == null)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) blogSettingsSingleton = new BlogSettings();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) return blogSettingsSingleton;  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif)}  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)

这个属性相信大家也能明白，blogSettingsSingleton是个私有静态字段，如果不为空，会返回blogSettingsSingleton，blogSettingsSingleton其实是个BlogSettings的一个实例。

如果为空的话，则会重新实例化，BlogSettings()实例化也是私有的，好处大家都知道。在实例化的时候，会调用Load()方法，我们来看下：

  


![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Load()  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)private void Load()  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) Type settingsType = this.GetType();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) System.Collections.Specialized.StringDictionary dic = Providers.BlogService.LoadSettings();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) foreach (string key in dic.Keys)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)   
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) string name = key;  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) string value = dic[key];  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)   
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) foreach (PropertyInfo propertyInformation in settingsType.GetProperties())  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)   
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) if (propertyInformation.Name.Equals(name, StringComparison.OrdinalIgnoreCase))  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)   
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) try  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) propertyInformation.SetValue(this, Convert.ChangeType(value, propertyInformation.PropertyType, CultureInfo.CurrentCulture), null);  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) catch  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) // TODO: Log exception to a common logging framework?  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) break;  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)

这段代码真的太棒了，我只能用惊叹来形容我自己的表情，先前看了代码之美，总觉得虽然有时候可以让你的代码更优美，但有时候不得不重复打着一定的赋值，让我一直很头疼。不得不静态微软的反射技术，让你的代码能更优美，而且性能也得到了提高。BlogEngine的这段代码就是一个很好的体现，充分利用了反射的作用，可能你会觉得其中用了一个嵌套的循环，会不会影响速度呢？我当时也很疑惑，因为我觉得有更好的方法来替换这个方法的，可作者为什么这么做呢？很简单，记得谁说过，**当性能不是问题的时候就不是问题了** 。因为这里，我们的配置最多最多100个吧，在如今的计算机中，这种循环的性能消耗都能忽略不计了，所以你不用过多的担忧性能，而且，在一定时间内，它也只会产生一次。或许你有更好的方法进行，你也可以自己修改一下代码，我觉得也是对自己的一个提高。

Load()方法会读取配置文件或者数据库，利用反射机制找到对应的属性进行赋值，然后把一个私有变量压入到内存中，这里有些许不灵活，因为你必须把你的字段名或者Xml的节点名与你类里的成员名相匹配。

有人说把配置压入内存中有些不方便，因为你随时随地可能进行修改，这时候怎么办呢？不用担心，我们来看看更精妙的Save()方法，他是个公共方法，是为了能让外部进行调用。

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Save()  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)public void Save()  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) System.Collections.Specialized.StringDictionary dic = new System.Collections.Specialized.StringDictionary();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) Type settingsType = this.GetType();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) foreach (PropertyInfo propertyInformation in settingsType.GetProperties())  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) try  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) if (propertyInformation.Name != "Instance")  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) object propertyValue = propertyInformation.GetValue(this, null);  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) string valueAsString = propertyValue.ToString();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) if (propertyValue.Equals(null))  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) valueAsString = String.Empty;  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) if (propertyValue.Equals(Int32.MinValue))  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) valueAsString = String.Empty;  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) if (propertyValue.Equals(Single.MinValue))  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) ![](https://www.cnblogs.com/Images/dot.gif){  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) valueAsString = String.Empty;  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) dic.Add(propertyInformation.Name, valueAsString);  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockStart.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedSubBlock.gif) catch ![](https://www.cnblogs.com/Images/dot.gif){ }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedSubBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)   
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) Providers.BlogService.SaveSettings(dic);  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif) OnChanged();  
![](https://www.cnblogs.com/Images/OutliningIndicators/InBlock.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockEnd.gif) }  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)  
![](https://www.cnblogs.com/Images/OutliningIndicators/None.gif)

你不得不佩服这些大师的作品，区区几十行代码，把你的顾虑都打消了。最后它用了OnChanged()方法，其中它调用了一个事件委托，以便你在保存后，只重新绑定新数据，其他数据的绑定还是从ViewState中提取，实在。。。。说实在的，真的很厉害，如果原先我做，肯定保存后，又全部完全的从配置源里重新读取一边，进行绑定的。突然想到一句话，只修改该修改之数据，精妙啊~~~

很多页面上的文字内容都需要自己在页面上修改，我想下一版可能会有所改观吧。

