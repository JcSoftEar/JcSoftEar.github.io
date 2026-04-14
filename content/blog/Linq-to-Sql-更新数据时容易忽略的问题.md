---
title: "Linq to Sql 更新数据时容易忽略的问题"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Linq to Sql 更新数据时容易忽略的问题

> 原文链接: https://www.cnblogs.com/inday/archive/2009/06/12/1502405.html | 迁移自博客园

---

越来越多的朋友喜欢用Linq to Sql来进行开发项目了，一般我们都会遇到CRUD等操作，不可否认，在查询方面Linq真的带来很大的便利，性能方面也表现不错，在插入操作和删除操作中，Linq的表现也还不错，但是在更新某条记录的时候，性能就相对比较弱了，我们一般会使用ExecuteSql等方法来执行脚本。

不过有时候，我们还是会使用Linq to Sql来进行Update，执行的步骤：获取一个记录-〉更新字段 -〉submitChanges()

昨天遇到了一个问题，流程都没有错，但是更新的时候始终没有更新到数据库，

大概得伪代码如下：

public void UpdateUser(User user)   
{   
DataContext context = new DataContext("conn");  User existsUser = GetUser(user.ID);   
existsUser.Name = user.Name;   
//.............  context.SubmitChanges();   
}  
---  
  
简单的代码，大概的意思也是获取一个记录，然后更新字段，再submitChanges，大体看看没有错，但是！！！！大家有没有发觉，我们的context是个私有变量，而我们的GetUser虽然也是从context中取得，不过它用的是它自己的context，也就是说对于程序来说，它是两个对象，所以我们这里在submitChanges的时候，无论你怎么改都是没有效果的，数据库中始终不会改变，My God ，或许你会觉得这谁不知道啊，但是往往我们真的会忽略这一点，记得以前考试，往往都是难的题目基本上全对，但越简单越容易的题目，却会经常犯错，希望这些能对你有些启发。

好了，知道了为什么出错，修改也简单了，两种方法：

方法一：   
public void UpdateUser(User user)   
{   
DataContext context = new DataContext("conn");  //从当前context取   
User existsUser = context.Users.SingleOrDefault(e => e.ID.Equals（user.ID);   
existsUser.Name = user.Name;   
//.............  context.SubmitChanges();   
} 方法二： //把context设成上下文公用的   
DataContext context = new DataContext("conn");  public void UpdateUser(User user)   
{ User existsUser = GetUser(user.ID);   
existsUser.Name = user.Name;   
//.............  context.SubmitChanges();   
}  
---  
  
标签: [C#](http://www.cnblogs.com/inday/tag/C%23/)，[linq to sql](http://www.cnblogs.com/inday/tag/linq+to+sql/)，[仔细](http://www.cnblogs.com/inday/tag/%e4%bb%94%e7%bb%86/)，[项目](http://www.cnblogs.com/inday/tag/%e9%a1%b9%e7%9b%ae/)

好了,文章比较简单,也或许你觉得不值得一提,目的也不是为了解决这个问题,希望大家能在做项目中,一定要仔细,因为往往你的一个小小的疏忽,会给项目、公司带来不可预知的后果。

