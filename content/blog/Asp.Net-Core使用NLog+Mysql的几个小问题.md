---
title: "Asp.Net Core使用NLog+Mysql的几个小问题"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Asp.Net Core使用NLog+Mysql的几个小问题

> 原文链接: https://www.cnblogs.com/inday/p/asp-net-core-use-nlog-for-mysql-some-issues.html | 迁移自博客园

---

项目中使用NLog记录日志，很好用，之前一直放在文本文件中，准备放到db中，方便查询。

项目使用了Mysql，所以日志也放到Mysql上，安装NLog不用说，接着你需要安装Mysql.Data安装包：
    
    
    Install-Package MySql.Data
    

接着打开你的NLog，新增一个`target`：
    
    
    <target xsi:type="Database"
        name="mysqlDb"
        dbProvider="MySql.Data.MySqlClient.MySqlConnection, MySql.Data"
        connectionString="Server=127.0.0.1;User Id=root;Password=root;Database=nlog;Character Set=utf8;SslMode=none;" />
    

> 如果你的数据库连接不支持SSL的话（开发机一般都没有吧），一定要加上`SslMode=none`

接着你需要创建数据库和表，建议你手动去mysql执行脚本，如果想自动创建的话，你可以查看[这里](https://github.com/NLog/NLog/wiki/Installing-targets)

创建数据库脚本：
    
    
     CREATE TABLE `log` (
      `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `Application` varchar(50) DEFAULT NULL,
      `Logged` datetime DEFAULT NULL,
      `Level` varchar(50) DEFAULT NULL,
      `Message` text DEFAULT NULL,
      `UserName` varchar(512) Default Null,
      `ServerName` text Default Null,
      `Url` text NULL,
      `RemoteAddress` nvarchar(100) NULL,
      `Logger` text DEFAULT NULL,
      `Callsite` text DEFAULT NULL,
      `Exception` text DEFAULT NULL,
      PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
    

然后修改下NLog中刚刚我们添加的`target`:
    
    
    <target xsi:type="Database"
                name="mysqlDb"
                dbProvider="MySql.Data.MySqlClient.MySqlConnection, MySql.Data"
                connectionString="Server=127.0.0.1;User Id=root;Password=root;Database=nlog;Character Set=utf8;SslMode=none;">
          
      <commandText>
         insert into log (
            Application, Logged, Level, Message,
            Username,
            ServerName, Url,RemoteAddress,
            Logger, CallSite, Exception
            ) values (
            @Application, @Logged, @Level, @Message,
            @Username,
            @ServerName, @Url,@RemoteAddress,
            @Logger, @Callsite, @Exception
        );
      </commandText>
    
      <parameter name="@application" layout="yourappname" />
      <parameter name="@logged" layout="${date}" />
      <parameter name="@level" layout="${level}" />
      <parameter name="@message" layout="${message}" />
      <parameter name="@username" layout="${identity}" />
      <parameter name="@serverName" layout="${aspnet-request-host}" />
      <parameter name="@url" layout="${aspnet-request-url:IncludeQueryString=true}" />
      <parameter name="@remoteAddress" layout="${aspnet-Request-ip}" />
      <parameter name="@logger" layout="${logger}" />
      <parameter name="@callSite" layout="${callsite}" />
      <parameter name="@exception" layout="${exception:tostring}" />
        
    </target>
    

可以看到在`commandText`中是添加日志的sql语句，下面就是各参数的值，使用的默认[layout]((<https://github.com/NLog/NLog/wiki/Layout-Renderers>)，你也可以[自定义layout](https://github.com/NLog/NLog/wiki/How-to-write-a-custom-layout-renderer)。

现在你可以启动你的项目，执行没有问题，但是在上述`aspnet-request`开头的一些值没有获取到，都为空，这是因为没有安装`NLog.Web`包，使用Nuget或者在Nuget控制台输入：
    
    
    Install-Package NLog.Web
    

再次运行，你会看到你的日志中已经记录的很全面了。

之前很久没写，觉得很多没必要写，但现在发现，还是记录下来比较好，或许对你有用呢，对吧！

