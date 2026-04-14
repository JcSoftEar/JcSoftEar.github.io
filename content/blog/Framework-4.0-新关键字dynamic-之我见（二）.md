---
title: "Framework 4.0 新关键字dynamic 之我见（二）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Framework 4.0 新关键字dynamic 之我见（二）

> 原文链接: https://www.cnblogs.com/inday/archive/2009/06/05/1497355.html | 迁移自博客园

---

Hi，大家好，随着大家对VS2010的深入了解，对dynamic已经是越来越了解了，何时该用，何时不用已经非常熟悉了，原本不打算再写下去的，但感觉还有点东西需要说说，就简单再说一下吧。 

原先以为dynamic实在runtime时确定的，后来看了一下，这个runtime是在微软新出的一个运行时DLR上的，动态的为你判断该使用何种类型，而不是原先的CLR，具体的大家可以参考微软的MSDN，因为英文不太好，以免误导大家，也就不写详细了。 

这几天一直在考虑何时去用这个关键字，如果对于一般的程序在没有与其他COM，API交互的情况下，使用dynamic会大大影响到程序性能，但如果与反射相比较的话，性能其实是在一个级别，也许更快，代码也会简单明了些。如果遇到与其他COM，API交互的情况下，dynamic就充分显示了它的优势，而且在某些时候，你在无交互程序中，使用dynamic也会给你带来不一样的体验。以下分两部分来说，都是些简单应用，一部分是与IronPython的交互，还有一部分是在无交互程序中，dynamic的用处。 

  1. 以前我们与IronPython交互的话，需要如此写： 

先定义一个py文件：helloworld.py 




## def welcome(name): 

##  return "Hello '" + name + "' from IronPython"  
  
---  
  
然后我们使用IronPython.Net 来调用这个文件中的这个方法（为了方便测试性能，我将定义两个方法） 

static void StaticUseIronPythonMethod()  {  var runtime = Python.CreateRuntime();  var scope = runtime.UseFile("helloworld.py");  Func<object, object> func = scope.GetVariable<Func<object, object>>("welcome");  func("StaticUseIronPythonMethod");  }  
---  
  
上面的代码其实很简单，创建一个Python的Rumtime，然后是调用我们先前写好的py文件，随后获取一下welcome这个方法，然后执行。 

我们再来看看用dynamic改写后的代码（注：一定要使用IronPython CTP 2.6 for VS2010，否则无法使用）： 

static void DynamicIronPythonMethod()  {  var runtim = Python.CreateRuntime();  dynamic hello = runtim.UseFile("helloworld.py");  hello.welcome("asdf");  }  
---  
  
看到吗？代码变得简单明了，就像在自己代码中定义了webclome方法，然后调用，非常的简单。这就是dynamic的神奇之处了，使我们代码跟美观，因为所有的一切，我们都交给DLR去完成了。 

可能大家会想到性能方面，经过测试，与IronPython交互的编写，如果用以往的方式写，一样会很慢，如果用dynamic的话，性能还会有小幅度的提高。我改写了老赵和b0b0的性能计数器，代码和结果如下： 

using (CodeTimer timer = new CodeTimer("DynamicIronPythonMethod"))  {  DynamicIronPythonMethod();  }  using (CodeTimer timer = new CodeTimer("StaticUseIronPythonMethod"))  {  StaticUseIronPythonMethod();  }  
---  
  
**结果：**

![](https://images.cnblogs.com/cnblogs_com/inday/060509_1543_Framework401.png)  
---  
  
大家看到了吧，其实两个是在同一级别的，但我们的代码却优雅了很多，至于多个方法，我没有测试，大家有空可以试试。 

原本打算今天把dynamic在一般应用中的有趣用法也写一下，不过发觉需要准备很多代码，因为没有好好准备，暂时先放一下，明后天再放上来。不过大概的场景如下： 

我通过一个入口，搜索一些内容，比如：商品，但是根据不同的商品类型，他们有不同的搜索条件，但是返回的东西都是相同的内容。如果你的解决方案是拼接字符串，进出据库查询的话，那你可以略过下一篇内容，因为我这里会很"时尚"的使用OO。 

大体如下： 

我有手机、书籍两种商品，我定义了这2个类，这两个类同时继承了商品类，我在搜索页面，可以根据不同条件进行搜索，但是页面显示的信息，其实都是商品类的一些属性。 

场景大概就是这样，原本以为会很快写好，但越来越发觉，这个应该详细说说，因为实际中我们已经遇到过，写的详细点，希望对大家也有帮助。 

好了，今天就写到这里了，经过了6天的小长工作日，终于可以放松一下了，大家晚安～ 

PS:米想到进入有道第二轮了，有进入的可以加我，大家多多探讨一下，嘿嘿

相关文章：“[Framework 4.0 新关键字dynamic之我见（一）”](http://www.cnblogs.com/inday/archive/2009/05/23/1487415.html)

