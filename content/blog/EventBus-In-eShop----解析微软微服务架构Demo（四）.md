---
title: "EventBus In eShop -- 解析微软微服务架构Demo（四）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# EventBus In eShop -- 解析微软微服务架构Demo（四）

> 原文链接: https://www.cnblogs.com/inday/p/eventbus-in-eshopcontainers.html | 迁移自博客园

---

# 引言

大家好像对分析源码厌倦了，说实在我也会厌倦，不过不看是无法分析其后面的东西，从易到难是一个必要的过程。

今天说下EventBus，前几天园里的[大神](http://www.cnblogs.com/sheng-jie/)已经把其解刨，我今天就借着大神的[肩膀](http://www.cnblogs.com/sheng-jie/p/6970091.html)，分析下在eShop项目中EventBus的实现。

最近发觉转发文章不写出处的，特此加上链接：<http://inday.cnblogs.com>

# 解析源码

我们知道使用EventBus是为了解除Publisher和Subscriber之间的依赖性，这样我们的Publisher就不需要知道有多少Subscribers，只需要通过EventBus进行注册管理就好了，在eShop项目中，有一个这样的接口IEventBus（eShopOnContainers\src\BuildingBlocks\EventBus\EventBus\Abstractions）
    
    
    public interface IEventBus
    {
        void Subscribe<T, TH>(Func<TH> handler)
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>;
        void Unsubscribe<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent;
    
        void Publish(IntegrationEvent @event);
    }

我们可以看到这个接口定义了EventBus所需的一些操作， 对比大神的EventBus，相关功能都是一致的，我们看下它的实现类：EventBusRabbitMQ，从名字上可以看出，这是一个通过RabbitMQ来进行管理的EventBus，我们可以看到它使用了IEventBusSubscriptionsManager进行订阅存储，也就是大神文中的：
    
    
    private readonly ConcurrentDictionary<Type, List<Type>> _eventAndHandlerMapping;

微软在Demo中把其提取出了接口，把一些常用方法给提炼了出来，但是核心还是Dictionary<string, List<Delegate>>， 使用Dictionary进行Map映射。通过Subscribe和UnSubscribe进行订阅和取消，使用Publish方法进行发布操作。
    
    
    public void Subscribe<T, TH>(Func<TH> handler)
        where T : IntegrationEvent
        where TH : IIntegrationEventHandler<T>
    {
        var eventName = typeof(T).Name;
        var containsKey = _subsManager.HasSubscriptionsForEvent<T>();
        if (!containsKey)
        {
            if (!_persistentConnection.IsConnected)
            {
                _persistentConnection.TryConnect();
            }
    
            using (var channel = _persistentConnection.CreateModel())
            {
                channel.QueueBind(queue: _queueName,
                                    exchange: BROKER_NAME,
                                    routingKey: eventName);
            }
        }
    
        _subsManager.AddSubscription<T, TH>(handler);
    
    }

我们看到在订阅的时候，EventBus会检查下在Map中是否有相应的注册，如果没有的话首先回去RabbitMQ中创建一个新的channel进行绑定，随后在Map中进行注册映射。

UnSubscribe则直接从Map中取消映射，通过OnEventRemoved事件判断Map下此映射的subscriber是否为空，为空则从RabbitMQ中关闭channel。

在RabbitMQ的构造方法中，我们看到这样一个创建：CreateConsumerChannel()，这里创建了一个EventingBasicConsumer，当Queue中有新的消息时会通过ProcessEvent执行Map中注册的handler（subscribers），看图可能更清晰些：

[![Event In eShop](https://images2015.cnblogs.com/blog/4871/201706/4871-20170629173146586-318649335.jpg)](http://images2015.cnblogs.com/blog/4871/201706/4871-20170629173145461-421750652.jpg)

在ProcessEvent方法中，回去Map中找寻subscribers，然后通过动态反射进行执行：
    
    
    private async Task ProcessEvent(string eventName, string message)
    {
    
        if (_subsManager.HasSubscriptionsForEvent(eventName))
        { 
            var eventType = _subsManager.GetEventTypeByName(eventName);
            var integrationEvent = JsonConvert.DeserializeObject(message, eventType);
            var handlers = _subsManager.GetHandlersForEvent(eventName);
    
            foreach (var handlerfactory in handlers)
            {
                var handler = handlerfactory.DynamicInvoke();
                var concreteType = typeof(IIntegrationEventHandler<>).MakeGenericType(eventType);
                await (Task)concreteType.GetMethod("Handle").Invoke(handler, new object[] { integrationEvent });
            }
        }
    }

微软通过简单的代码解耦了Publisher和Subscribers之间的依赖关系，我们引用大神的总结：

[![image](https://images2015.cnblogs.com/blog/4871/201706/4871-20170629173148196-253244909.png)](http://images2015.cnblogs.com/blog/4871/201706/4871-20170629173147336-541730774.png)

# 应用

在catalog.api中，微软出现了EventBus，我在[上一篇](http://www.cnblogs.com/inday/p/catalog-service-eshopOnContainers.html)中也提到了，这是我的一个疑惑，因为在catalog中并没有订阅操作，直接执行了Publish操作，原先以为是一个空操作，后来看了Basket.Api我才知道为何微软要用RabbitMQ。

使用RabbitMQ，我们不仅是从类之间的解耦，更可以跨项目，跨语言，跨平台的解耦，publisher仅仅需要把消息体(IntegrationEvent)传送到RabbitMQ,Consumer从Queue中获取消息体，然后推送到Subscribers执行相应的操作。我们看下Basket.Api.Startup.cs：
    
    
    protected virtual void ConfigureEventBus(IApplicationBuilder app)
    {
        var catalogPriceHandler = app.ApplicationServices
            .GetService<IIntegrationEventHandler<ProductPriceChangedIntegrationEvent>>();
    
        var orderStartedHandler = app.ApplicationServices
            .GetService<IIntegrationEventHandler<OrderStartedIntegrationEvent>>();
    
        var eventBus = app.ApplicationServices.GetRequiredService<IEventBus>();
    
        eventBus.Subscribe<ProductPriceChangedIntegrationEvent, ProductPriceChangedIntegrationEventHandler>
            (() => app.ApplicationServices.GetRequiredService<ProductPriceChangedIntegrationEventHandler>());
    
        eventBus.Subscribe<OrderStartedIntegrationEvent, OrderStartedIntegrationEventHandler>
            (() => app.ApplicationServices.GetRequiredService<OrderStartedIntegrationEventHandler>());
    }

在这个方法里，我们看到了Subscribe操作，想想之前的提问有点搞笑，不过研究明白了也不错，对吧！

# 总结

今天我们看了EventBus在Demo中的应用，总结一下。

1、EventBus可以很好的解耦订阅者和发布者之间的依赖

2、使用RabbitMQ能够跨项目、跨平台、跨语言的解耦订阅者和发布者

虽然在Demo中我们看到对订阅者的管理是通过Dictionary内存的方式，所以我们的Subscribe仅仅只在Basket.Api中看到，但微软是通过IEventBusSubscriptionsManager接口定义的，我们可以通过自己的需求来进行定制，可以做成分布式的，比如使用memcached。

# 写在最后

每个月到下旬就会比较忙，所以文章发布会比较慢，但我也会坚持学习完eShop的，为了学习，我建了个群，大家可以进来一起学习，有什么建议和问题都可以进来哦。

eShop虽好，但不建议大家放到生产环境，毕竟是一个Demo，而且目前还是ALPHA版本，用来学习是一个很好的教材，这就是一个大杂烩，学习中你会学到很多新的东西，大家如果看好core的发展，可以一起研究下。

QQ群：376248054

