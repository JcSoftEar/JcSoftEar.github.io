---
title: "Asp.Net Core SignalR 用泛型Hub优雅的调用前端方法及传参"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Asp.Net Core SignalR 用泛型Hub优雅的调用前端方法及传参

> 原文链接: https://www.cnblogs.com/inday/p/signalR-core-grace-call-client-methods.html | 迁移自博客园

---

## 继续学习

最近一直在使用Asp.Net Core SignalR(下面成SignalR Core)为小程序提供websocket支持,前端时间也发了一个[学习笔记](https://www.cnblogs.com/inday/p/signalr-wechat-miniapp.html)，在使用过程中稍微看了下它的源码,不得不说微软现在真的强大,很多事情都帮你考虑到了,比如使用Redis,使用Redis后,你的websocket就支持横向扩展了,使用的方式也特别简单,只需要在`services.AddSignalR`的后面再加上:
    
    
    .AddRedis(options =>
    {
        options.Configuration.ConnectTimeout = 30;
        options.Configuration.EndPoints.Add("redis ip");
    })
    

SignalR Core利用了Redis的发布订阅功能,就实现了横向扩展,再也不用担心一台ws服务器不够用了.

今天要说的并不是SignalR Core的负载均衡方式,而是如何优雅的调用前端方法。大家都知道SignalR Core除了可以建立websocket连接，还能双向调用，服务器调用客户端方法，客户端也能调用服务器的方法。

## 原始调用

我们看下如何调用客户端方法：
    
    
    public class ChatHub : Hub
    {
        //服务端方法
        public async Task SendMessage(string user, string message)
        {
            //ReceiveMessage 为客户端方法，让所有客户端调用这个方法
            await Clients.All.SendAsync("sayHello", user, message);
        }
    }
    

还是ChatHub~~~~~

我们可以看到在这里我们调用了客户端的sayHello,并传递了两个字符串参数user,message,是不是觉得丑陋,说实在的真心看不下去哈。而且不变维护，相当于你要把方法名硬编码，传递多少个参数也没有个准，没有好的文档后期很难维护。好在微软已经为我们考虑到了这个情况，我们可以把客户端的方法用接口的方法定义了！！！对！没错，用接口的方式定义客户端的方法！！

## 优雅调用

使用的方式也超级简单，我们先定义一个客户端的接口：
    
    
    public interface IMyClient
    {
        Task SayHello(string user, string message);
    }
    

然后我们的Hub集成Hub，T就是你定义的客户端接口，这里也就是IMyClient，我用上面的ChatHub举例：
    
    
    public class SendMessageHub : Hub<IMyClient>
    {
        public async Task SendMessage(string user, string message)
        {
            await this.Clients.All.SayHello(user, "from server:" + message);
            //ReceiveMessage 为客户端方法，让所有客户端调用这个方法
            //await Clients.All.SendAsync("sayHello", user, message);
        }
    }
    

注释掉的是我之前的方式，SayHello是客户端的方法，会通过websocket传递到前端，下图为我用小程序通讯产生的结果：  
![image](https://github.com/JamesYing/mpdevclass/blob/master/blogs/20180906215111.png?raw=true)  
是不是SoEasy？？我觉得还不算完，我们参数目前是按照数组的方式传递的，如果有限定的参数名就完美了，我们改造下IMyClient：
    
    
    public interface IMyClient
    {
        Task SayHello(HelloMessage message);
    }
    
    public class HelloMessage
    {
        public string User { get; set; }
        public string Message { get; set; }
    }
    

修改下我们的Hub的SendMessage方法：
    
    
    public  Task SendMessage(string user, string message)
    {
        return this.Clients.All.SayHello(new HelloMessage()
        {
            User = user,
            Message = "from server:" + message
        });
    
        //return this.Clients.All.SendAsync("sayHello", $"from server:{message}");
    }
    

在运行下我们的小程序：  
![image](https://github.com/JamesYing/mpdevclass/blob/master/blogs/20180906220201.png?raw=true)  
LooK，方法名没有改变，但是我们返回的参数成了一个对象，如果看过我之前[那篇博文](https://www.cnblogs.com/inday/p/signalr-wechat-miniapp.html)的话，应该记得在前端的时候，我需要做一个映射，来调用前端的方法，在映射中，我参数使用的是数组进行传递的，现在不需要去看数组中第几个参数是我需要使用的了，你完全可以使用：
    
    
    callMethods(methods, args) {
        console.log(methods, args);
        let self = this;
        let arg = args[0];
        switch (methods) {
            case 'SayHello':
                self.sayHello(arg.message);
                break;
        }
    },
    

这里还有个问题，就是接口中的方法名是大写开头的，而js的规范呢一般都是小写开头的，所以在映射方法的时候需要注意下，反正这个大小写问题有点不是很爽，参数在传递的时候倒是直接转换成首字母小写，我相信SignalR Core是可以实现的，只是我不知道而已，稍后在研究研究，如果可行，我会更新此篇博文。如果你要在接口中用小写来定义这个方法，也没有问题，但我觉得就是不符合规范，习惯不允许我如此粗糙，哈哈。

## 写在最后

至于调用的原理，我没有细看，正好在看源码的时候，看到了Hub，很疑惑，尝试了下后才发觉SignalR的牛逼，后来发现其实在SignalR 2.1中引用了这个概念，估计很多人已经在用了，但好像提到的人很少，包括微软的文档，这次也是意外发现，赶快记录下来，希望对您有用。

Asp.Net Core SignalR确实很强大，有兴趣的可以去[gayhub](https://github.com/aspnet/SignalR)上去研究下他们的源码。

