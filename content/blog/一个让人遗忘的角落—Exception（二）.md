---
title: "一个让人遗忘的角落—Exception（二）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 一个让人遗忘的角落—Exception（二）

> 原文链接: https://www.cnblogs.com/inday/archive/2009/04/21/1440188.html | 迁移自博客园

---

在上一篇中"[](http://www.cnblogs.com/inday/archive/2009/04/17/1437657.html)[一个被人遗忘的角落\--Exception（一）](http://www.cnblogs.com/inday/archive/2009/04/17/1437657.html)"中，跟大家简单介绍了一下Exception，也使大家充分的了解了Exception管理在一个项目中的重要性，那如何在我们的项目中处理异常呢？因为我从事的是Web开发，所以我只跟大家讨论Web的解决方案，Win的解决方式，还希望同大家一起探讨。

上一章中我们了解了异常发生的原因，同时也说了不存在没有bug的程序，任何网站都会遇到各种各样的问题，无论是大网站还是小网站都会存在，但大公司和小公司对待异常的态度全然不同，一个是主动出击，一个是守株待兔，我们是好的开发者，我们不能坐以待毙，我们必须主动出击。好了，废话少说，切入主题。

现在网站一般都采用多层开发，多层开发的时候，我们应该在哪里处理异常、在抛出异常呢？微软的意见是类库的开发人员尽量不要处理异常，类库的编写应该按照正常的逻辑去编写，当然也有例外，注意事项可以参见"[](http://www.cnblogs.com/inday/articles/1437646.html)[设计异常解决方案的几点注意事项 ](http://www.cnblogs.com/inday/articles/1437646.html)"，好的，按照规范，我们应该尽量在高层进行捕捉和处理，那我们该怎么捕捉，捕捉后怎么处理，捕捉哪些异常呢？虽然微软提供了很多系统异常，但是这些异常只是负责抛出相关的信息，并没有为记录下来，或者出现高级异常的时候，及时通知我们，这样的做法还是守株待兔，我们还是应该主动的对其进行处理。好在微软让我们可以自由的创建自定义的Exception，最好是设定一个自定义Exception基类，让你的其他自定义Exception都继承这个类，以便今后更好的扩展。抛出异常其实是性能消耗很大的操作，但是Richer教父说过，抛出异常的性能和你程序的稳定性相比，就变得非常渺小了。所以我们还是偏向于稳定性。因为处理异常的性能消耗，只是在异常发生时才产生，所以性能方面的问题，我们可以忽略了。（或许这话比较拗口，但相比系统的性能，我更趋向于系统的稳定）

**如何创建一个自定义的 Exception？******

不得不说微软考虑的太周到了，要创建一个自定义的Exception是非常简单的。打开VS，创建一个项目，然后添加一个类，在namespace范围内，输入Exception，然后2下Tab，VS就自定帮您创建一个自定义的Exception了。Exception的相关属性和方法，可以参见MSDN。不过自动创建的Exception都是继承System.Exception的，按照微软当初的设想，自定义的异常应该继承System.ApplicationException (可笑的是，微软自己都没有遵守这个约定)。我们设定这个作为我们的Exception基类 MyBaseException。

代码片断：

[global::System.Serializable] 

public class MyBaseException : ApplicationException 

{ 

public MyBaseException() { } 

public MyBaseException(string message) : base(message) { } 

public MyBaseException(string message, Exception inner) : base(message, inner) { } 

protected MyBaseException( 

System.Runtime.Serialization.SerializationInfo info, 

System.Runtime.Serialization.StreamingContext context) 

: base(info, context) { } 

}

这就是一个标准的自定义Exception了，至于其它的自定义Exception，应该根据你的项目来进行相关的定义。

在进行其他定义之前，我们先来想想，我们捕捉这些Exception之后我们需要做些什么？我们需要知道异常发生的各种信息，所以我们需要Log。Log能方便的让我们查阅发生的异常及Log的异常信息。Log有很多方式，大概的有以下几种：

文本记录

数据库记录

系统事件记录（Trace）

第三方组件（Log4Net）

这几种方式各有利弊，可以根据项目的需求进行选择，当然你也可以几种方式合用，比如我们默认的是文本记录方式，但是在创建Log时发生了System.IOException时,我们就必须选择其他的方式进行Log。

**Log 方式** |  **便捷性** |  **查阅性** |  **安全性** |  **结合性**  
---|---|---|---|---  
**文本记录** |  方便 |  一般 |  低 |  高  
**数据库记录** |  一般 |  方便 |  一般 |  高  
**系统事件记录** |  复杂 |  复杂 |  高 |  一般  
**第三方组件** |  复杂 |  一般 |  一般 |  低  
  
我列举了几种方式的利弊，大家可以有条件的选择。如果你的项目中已经使用第三方组件记录方式，那我建议您使用它。在我后面的解决方案中，我会利用前2种比较常见的方式相结合。

Log的目的是为我们开发者提供发生异常的时间、地点、人物、原因，所以我们必须尽可能的详细地记录，根据一个Exception获取信息的方法：

**Data** |  **Source**  
---|---  
**Dates and Times** |  DateTime.Now  
**Source of Exception** |  Exception.Source  
**Type of Exception** |  Object.GetType  
**Exception Message** |  Exception.Message  
**Current Method** |  Reflection.MethodInfo.GetCurrentMethod  
**Machine Name** |  Environment.MachineName or Dns.GetHostName  
**CurrentIP** |  Dns.GetHostByName("host").AddressList[0].Address  
**Call Stack** |  Exception.StackTrace or Environment.StackTrace  
**OS Information** |  Environment.OSVersion  
**Applcation Domain** |  AppDomain.FriendlyName  
**Current Assembly** |  Reflection.Assembly.GetExecutingAssembly  
**Root Error Cause** |  Exception.GetBaseException  
**Chained Exception** |  Exception.InnerException  
**Assembly Version** |  Included in AssemblyName.FullName  
**Thread ID** |  AppDomain.GetCurrentThreadId  
**Thread User** |  Threading.Thread.CurrentPrincipal  
  
我们可以根据上面的表格，构建我们自己所需要的Log信息。为了便捷的管理，我们应该采用同一格式，进行Log。这里贴一个我写的信息格式，以供参考：

public static class ExceptionLogFormatHelper 

{ 

public static string ExceptionLogFormatter(Exception ex) 

{ 

StringBuilder sbLog = new StringBuilder("\r\n------------------------------------\r\n"); 

Exception ochainException = ex; 

var currentExceptionIndex = 1; 

while (ochainException != null) 

{ 

sbLog.Append("\r\nException " \+ currentExceptionIndex + " )") 

.Append("\r\nException Type:" \+ ochainException.GetType().FullName) 

.Append("\r\nException Source:" \+ ochainException.Source) 

.Append("\r\nException Message:" \+ ochainException.Message) 

.Append("\r\nException Date:" \+ DateTime.Now) 

.Append("\r\nEnvironment Stack:" \+ System.Environment.StackTrace); 

ochainException = ochainException.InnerException; 

currentExceptionIndex++; 

} 

sbLog.Append("\r\n------------------------------------\r\n"); 

return sbLog.ToString(); 

} 

} 

你也可以根据你自己想要的信息构建这么一个方法。

这一篇废话多了点，不过还是有必要了解下。还介绍了自定义异常的创建，日志方式的对比，在下一篇，我将介绍通知、异常处理流程和定义自己的一个MyBaseException。

