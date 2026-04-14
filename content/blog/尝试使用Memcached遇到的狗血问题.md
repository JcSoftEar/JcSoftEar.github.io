---
title: "尝试使用Memcached遇到的狗血问题"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 尝试使用Memcached遇到的狗血问题

> 原文链接: https://www.cnblogs.com/inday/p/memcached-question-unity.html | 迁移自博客园

---

乘着有时间，尝试下利用Memcached进行分布式缓存，其中遇到了不少问题及狗血的事情，开篇记录下，希望对您有帮助。

我之前的项目为：Asp.Net MVC4 + Nhibernate + MSSQL，利用简单分层，在用缓存时写了个缓存接口（还好当时写了），所以在此基础上，我的改动其实很简单，实现这个接口，再切换到Memcached就可以了。

# 搭建Memcached服务器

搭建服务器很简单，我用虚拟机虚拟了Ubuntu Server，为何使用Server版本呢？搭建起来比较快，而且启动也快，使用该用的功能就够了。搭建后，利用apt-get进行安装

> apt-get memcached

安装后，memcached其实已经自动启动了，接下来遇到狗血问题了！

一、telnet 无法连接，解决方案：

检查VirtualBox的网络连接方式，如果为NAT请改为桥接模式。此时还无法连接！！因为默认的Memcached配置，使用了本机ip：127.0.0.1 ，此时利用VI修改下配置

vi /etc/memcached.conf

文件打开后，修改下，把-l前面加入#号注释掉，重启服务器就可以了。您也可以修改其他默认配置，比如-m后的缓存区大小，-p 端口号等，参数命令可以参考我之前的[命令文档](http://www.cnblogs.com/inday/p/memcached-server-command.html)

好了，这时候在本机上，cmd-telnet ip 11211 看下是否已连接成功，如果还不行，请留言。

第一步好了，接下来就是程序的改写了

# Memcached Client的使用

在Client选择上，我用了Enyim.Cache，@dudu推荐滴，不过已经好久没更新了，我在其[github](https://github.com/enyim/EnyimMemcached)上下载的源码，在编译时出现了强名称的错误，最后利用NuGet 搜索Enyim就能找到了。Enyim使用起来很简单，只要在config中配置好Memcached的地址及端口，就能利用MemcachedClient类进行操作了。配置如下：
    
    
    <sectionGroup name="enyim.com">
          <section name="memcached" type="Enyim.Caching.Configuration.MemcachedClientSection, Enyim.Caching" />
        </sectionGroup>
    
    
    <enyim.com>
        <memcached protocol="Binary">
          <servers>
            <add address="192.168.10.108" port="11211" />
          </servers>
          <socketPool minPoolSize="10" maxPoolSize="100" connectionTimeout="00:01:10" deadTimeout="00:02:00" />
        </memcached>
      </enyim.com>

之前说过我用了个Cache的接口,我只要是实现一个Memcached就可以了.我的接口如下：
    
    
     public interface ICacheProvider
        {
            void Set(string key, object value);
    
            void Set(string key, object value, DateTime expiration);
    
            void Remove(string key);
    
            bool Contains(string key);
    
            int Count
            {
                get;
            }
    
            void Flush();
    
            object GetData(string key);
    
            Dictionary<string, object> GetDatas(string[] keys);
    
            object[] GetDataArray(string[] keys);
        }

其实很多MemcachedClient都有，Set对应Store(StoreMode,key,value,expriation)
    
    
    using (var mc = MemcachedClientFactory.GetClient)
        {
            mc.Store(StoreMode.Set, key, value, expiration);
        }

在此建议您在开发环境下，使用ExecuteStore方法进行存储，这样遇到问题可以抛出错误
    
    
            using (var mc = MemcachedClientFactory.GetClient)
                {
                    
    #if DEBUG
                    var result = mc
                        .ExecuteStore(StoreMode.Set, key, value, expiration);
                    if (!result.Success)
                    {
                        if (result.Exception != null)
                        {
                            throw new Exception(String.Format("Message:{0}, key:{1}", 
                                result.Message,
                                key),
                                result.Exception);
                        }
                        else
                        {
                            throw new Exception(
                                String.Format("Message:{0}, Code:{1}, Key:{2}",
                                result.Message,
                                result.StatusCode,
                                key));
                        }
                    }
    #else
                    mc.Store(StoreMode.Set, key, value, expiration);
    #endif
                }

MemcachedClientFactory.GetClient是一个工厂，方便以后如果有需求可以更改客户端。这里要注意下，有时候ExecuteStore不成功不会抛出Exception，但有Message，可以自定义个Exception抛出。

实现后原以为一切都如此简单，可事实并非如此。您现在看到的实现我用了using，每次创建client，每次关闭，之前不是这样，我使用的是单例模式，狗血的问题发生了。

## _Failed_ _to_ _read_ _from_ _the_ _socket_ ‘xxx.xxx.xxx.xxx’

从服务器无法读取。。。服务器一切正常，代码跟踪后，发觉在缓存的时候，有几条能缓存，有几条无法缓存，百度，狗狗，都无法找到满意的答案，随后就把MemcacheClient（下面简称mc）改成了每次打开和关闭（是否会影响性能，不得而知，求dudu赐教）

改了以后，这个问题算解决了，但原理为何还未知，希望有大侠指点。

解决了一个问题又来一个！！

## too large

你妹的，原来memcached默认配置下，对单个对象的大小进行了限制，默认情况是1M，查看了自己需要缓存的对象，确实数据量比较大，自己对缓存出的数据没有进行筛选字段，好吧！为了不破坏之前的程序，我没有对数据进行修改，而是修改了memcached server上的配置，vi配置文件，添加 –I 5m，重启，好了，算勉强解决了，把单个缓存对象改成5M了 - -（勿喷）

想想应该可以了吧！又来了个更狗血的：

#### _Message:Invalid arguments, Code:4,_

。。。。神马意思啊？？？参数错误。。。进入Debug，跟踪到某个缓存的时候，无法进行缓存，查看数据不大啊，那到底神马问题啊！！！不经意间，看了下key的值。。。。。你妹。。。超长字符，因用了自定义个一个key生成器，把相关参数都一个一个拼接起来的，so。。。。，看了下长度：280，难道memcached的key有长度限制？？速速百度，果然，key默认情况下是250长度，但你又无法配置其长度，好在我的key是由一个静态方法生成的，汗啊！把长度限制了下，超过的截断，ok了，问题解决！。

在用Memcached时，还遇到了连接池问题，遇到了定位不成功问题，不过这些都是小问题，自己配置了2个server，一个server被我关闭了，so。。。自己的问题，大家也注意下。

接下来的问题，比较头大，看官请看：

[![image](https://images0.cnblogs.com/blog/4871/201403/141250226679862.png)](https://images0.cnblogs.com/blog/4871/201403/141250222674219.png)

GroupedEnumerable未标记为序列化。。。。可恶啊，之前都是用Where,Order,Select,Group之类的方法并未ToList，这时候有点厌恶微软了，为嘛不能序列化。。。。List<T>是个可序列化的类型，为什么这些Enumerable无法序列化呢？？大神指点。。。

在尝试了把几个Enumerable转换成List后，问题解决了，但程序中好多地方都这样写的，想想目前公司不会转到Memcached，随后放弃了后面的修改，因为我的目的仅仅是玩一下而已，呵呵。还有个问题要注意：您要缓存的对象必须都要能够序列化的，一般都是数据库Model，要在Model类上，加上Serializable特性，否则无法传输。在查看了Enyim的源代码后，发现其实是使用DefaultTranscoder.Serialize方法进行序列化的，如果您不想改变您之前的所有东东，您可以自己写个ITranscoder的实现，可以通过配置文件切换。

玩过了Memcached后，准备切换回之前的WebCache模式，想想最近看了IOC的书，对于这种小型的IOC来说，用微软的Unity就可以了，那就再玩下吧！利用Nuget下载Unity。。。。报错！！！真的，报错！！！我用的是管理器下载，提示版本不符。。。看了项目介绍后知道了，原来目前的版本支持的是Framework4.5以上！你妹，那好，我下载低版本的吧，进入了Nuget的控制台，输入Install-Package Unity –Version 2.1.505.0

[![image](https://images0.cnblogs.com/blog/4871/201403/141250232945505.png)](https://images0.cnblogs.com/blog/4871/201403/141250230419048.png)

因为第一次用，所以遇到了蛮多问题，记录下，希望对大家有帮助。今天不是教程，仅仅是开发中遇到的各类问题，自己琢磨这解决，在使用第三方的模块时，请尽量下载其源代码，对您会有帮助的。对于Memcached我刚用，还了解的不多，目前只是简单的缓存后读取，更高层次的话还需要进步学习。

请不要吝啬您的左键，点击推荐支持一下，谢谢！

