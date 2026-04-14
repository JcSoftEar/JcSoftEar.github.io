---
title: "利用反射自己写的一个ModelHelper类"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 利用反射自己写的一个ModelHelper类

> 原文链接: https://www.cnblogs.com/inday/archive/2008/12/23/1360495.html | 迁移自博客园

---

开发中 很多人都会使用BLL Model这种开发，我也是，虽然现在有很多的自动生成工具，能在几秒内生成cs的模板，但我个人还不是很喜欢，我还是喜欢自己一个一个去写，这样更能了解自己的代码。

不过手动编写的时候，最讨厌的就是GetModel这类方法了，把datarow的数据转换成一个Model，实在写的我头疼，因为很多代码基本上都是一样的，一直想用反射来写这样一个方法，以后只要调用一个方法就能完成Model的赋值，那样就方便了。今天又遇到此类代码了，一时火大，自己写了个方法，采用的反射的原理（从BlogEngine里学来的），或许这个方法比较笨拙，或许有其他更好的方法来实现，不过目前是能满足我的GetModel的需求了，也就凑活着放上来，希望大家能给我更好的建议。

废话不说了 代码如下：

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Code  
public class ModelHelper <T> where T : new()  
{  
public static T ConvertModel(DataRow dr)  
{  
T t = new T();  
Type modelType = t.GetType();  
foreach (PropertyInfo p in modelType.GetProperties())  
{  
p.SetValue(t, GetDefaultValue(dr[p.Name], p.PropertyType), null);  
}  
return t;  
}  
  
private static object GetDefaultValue(object obj, Type type)  
{  
if (obj == DBNull.Value)  
{  
obj = default(object);  
}  
else  
{  
obj = Convert.ChangeType(obj, type);  
}  
return obj;  
}  
  
}

范例：

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Code  
Model model = ModelHelper<Model>.ConvertModel(DataRow)

ConvertModel静态方法就是转换的，GetDefaultValue方法则是获取object的默认值的，因为从DataRow里取到的值，有时候是DBNull，如果直接赋值的话会Throw错误的。

不好的地方：

1、Model类必须与DataRow的列名一一对应

2、Model类我设定了必须要有析构器的

代码或许不是很理想，希望大侠们指点一二。

Email:dally_2000@163.com

PS：明天就是平安夜了，希望大家玩的开心

PS2：好兄弟的爸爸去了，有点难过，愿他在天堂能快乐

PS3：大家帮个忙，我做了个网站给我老婆，希望大家能踊跃的留言祝福。

网址：<http://www.yangwenjie.cn/flash.html>

