---
title: "Asp.Net Core SignalR 与微信小程序交互笔记"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Asp.Net Core SignalR 与微信小程序交互笔记

> 原文链接: https://www.cnblogs.com/inday/p/signalr-wechat-miniapp.html | 迁移自博客园

---

# 什么是Asp.Net Core SignalR

Asp.Net Core SignalR 是微软开发的一套基于Asp.Net Core的与Web进行实时交互的类库，它使我们的应用能够实时的把数据推送给Web客户端。

## 功能

  * 自动管理连接
  * 允许同时广播到所有客户端
  * 也可以广播到指定的组或者特定的客户端
  * 在Github上开源，[传送门](https://github.com/aspnet/signalr)



SignalR 提供了多种连接方式，在现代化应用中，WebSocket是最佳的传输协议，在客户端无法实现WebSocket协议的时候，SignalR就会采取其他方式，比如Server-Sent或者长轮询（在ws未出现之前，我们讨论的推拉模式）

## 中心 Hubs

SignalR是采用中心客户端和服务器进行通讯。

中心是一种高级的管道，允许客户端和服务器之间相互调用方法。

中心通过强类型参数传递给方法，进行模型绑定

### Hubs.Clients

Clients属性包含了所有的客户端连接信息，它包含了3个属性：

  * `All` 所有客户端
  * `Caller` 进行此次请求的客户端
  * `Others` 排除此次请求客户端的其他客户端  
包含了多个方法：  
= `AllExcept` 在指定的连接除外的所有连接的客户端上调用方法
  * `Client` 在特定连接的客户端上调用方法
  * `Clients` 在特定连接的客户端上调用方法
  * `Group` 调用指定的组中的一种对所有连接方法
  * `GroupExcept` 调用中指定的组，除非指定连接到的所有连接的方法
  * `Groups` 调用一种对多个组的连接方法
  * `OthersInGroup` 调用一种对一组的连接，不包括客户端调用 hub 方法方法
  * `User` 调用一种对与特定用户关联的所有连接方法
  * `Users` 调用一种对与指定的用户相关联的所有连接方法



每个属性和方法返回的对象都包含一个`SendAsync`方法，可以对客户端进行调用。

## HubContext

可以在应用其他地方通过使用IHubContext，达到调用Hub的目的。

## 两种协议

  * 文本协议：JSON
  * 二进制协议：[MessagePack](https://msgpack.org/)



MessagePack类似于JSON，但传输比JSON更快，数据大小比JSON更小

## 服务器事项

  * 创建的Hub必须继承`Microsoft.AspNetCore.SignalR.Hub`,Hub类已经包含了管理连接、组和发送接收消息的属性及事件
  * 在Hub中使用的方法应该尽量使用异步的方式，因为SignalR在发送和接收消息的时候使用的是异步方法。
  * 在`Startup.ConfigureServices`中通过`services.AddSignalR`对SignalR进行注册
  * 在`Startup.Configure`中通过`app.UseSignalR`方法对Hub路由进行配置



## 代码解析

[微软官方示范](https://docs.microsoft.com/en-us/aspnet/core/tutorials/signalr?view=aspnetcore-2.1&tabs=visual-studio)中的ChatHub：
    
    
    using Microsoft.AspNetCore.SignalR;
    using System.Threading.Tasks;
    
    namespace SignalRChat.Hubs
    {
        public class ChatHub : Hub
        {
            //服务端方法
            public async Task SendMessage(string user, string message)
            {
                //ReceiveMessage 为客户端方法，让所有客户端调用这个方法
                await Clients.All.SendAsync("ReceiveMessage", user, message);
            }
        }
    }
    

上述代码为当收到客户端发来的`SendMessage`请求后（发送聊天信息），我们把消息发送到所有客户端，让他们调用自身的`ReceiveMessage`方法。

## 用户标识

通常情况下，在用户进行连接后，Connection会保存用户的用户标识，以便对特定用户进行发送消息。

可以实现`IUserIdProvider`来自定义获取用户的方法，例如：
    
    
    public class CustomUserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.Email)?.Value;
        }
    }
    

在`Startup.ConfigureServices`中注册：
    
    
        services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
    

## Group 分组

分组类似于聊天室中的每个房间，通过分组，我们可以给特定小组发送消息。

> 用户标识和组名称都是区分大小写的。

# 微信小程序与SignalR交互

小程序因为无法直接使用websocket，所以无法使用signalR.js，你可以试着把signalR.js中的webcosket使用部分换成wx.xxSocketxxx。

在参考了[算神](http://blog.lishewen.com/)的[代码](https://github.com/lishewen/WeChatMiniAppSignalRClient)后，归了一个小类库，方便大家使用，源码较长，我放到了github上，点击【[传送门](https://github.com/JamesYing/signalR4Miniapp)】进入。

## 如何使用

### 调用类库

在要使用的页面上：
    
    
    ///引入这个类库
    var signalR = require('../../lib/signalr/signalr.js')
    ///实例化一个对象
    let _client = new signalR.signalR();
    

### 创建 一个映射方法

这是为了让小程序收到SignalR的消息之后进行回调
    
    
    callMethods(methods, args) {
            console.log(methods, args);
            let self = this;
            switch (methods) {
                case 'sayHello':
                    self.sayHello(args[0]);
                    break;
            }
        },
    

例子里有一个sayHello方法，我们用字符串作为key。

### 进行连接
    
    
    _client.connection(url, methodMapping);
    

  * url : signalR服务器
  * methodMapping : 方法和字符串之间的Mapping



### 调用SignalR方法
    
    
     _client.call(methodName, args, success, fail)
    

  * methodName:远程方法名
  * args：参数，**这里注意一定要数组格式**
  * success：调用成功后的回调
  * fail：失败后的回调



# 写在最后

最近真的忙，忙成一道闪电，正好遇到这个问题随之记录下。类库可能并不完善，你可以在github上提issue，我会跟进的，有好的修改方式，你也可以PR我。

