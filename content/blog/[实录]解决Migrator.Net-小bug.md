---
title: "[实录]解决Migrator.Net 小bug"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [实录]解决Migrator.Net 小bug

> 原文链接: https://www.cnblogs.com/inday/archive/2009/10/26/Migrator-Net-Bug.html | 迁移自博客园

---

好久没写了，平时比较忙，只能趁周末的时候，写一点小东西，自己也记录一下。

平时我们做项目的时候，都会有自己的数据访问层，为了能方便以后的升级，我们一般会抽象出数据访问层，利用某些方式（比如[工厂模式](http://en.wikipedia.org/wiki/Factory_method_pattern)），达到数据库类型的切换，这大大提高了我们的开发效率，只需要修改建立一个新数据库，再配置的时候修改一下就能使用了。但每次我们必须要建立这个新的数据库，有时候这个工作量也非常的大，如果不熟悉的人，还可能建立的数据库与原先的数据访问不兼容，那怎么解决呢？有什么办法使我们建立数据库能够统一呢？答案是肯定的，我们今天讲的Migrator.Net就是这样一个方便的数据迁移工具，看它的名字就能猜到，可能是从Java项目转过来的，呵呵，这个不重要，重要的时，真的很有用，方便了我们。至于如何用，大家有兴趣的话，可以研究下，或者下次就写[Migrator.Net](http://groups.google.com/group/migratordotnet-devel)的简单使用吧。

今天我说的是，这次项目中遇到的某个问题，还有解决方案。

# 问题场景

在项目中，我用Migrator.Net建立了一个User表，创建没有问题，但在回滚版本的时候，却发生了不能删除的问题。

# 问题研究

首先，我换了User表的名字，比如Users，Migrator正常运行，能够回滚，ok，大概的原因知道了。

因为我用的是Sql Server 2005，在MsSql中，User是一个关键字，也就是说我们建立和创建的时候，必须加[],比如：

Create Table [User]

Drop Table [User]

查看我的Migrator代码，已经加入了中括号，那是什么原因呢？因为运行中也没有抛出任何错误，看来只能看他的源代码了。好在我们可以通过Migrator.Net的[Svn下载其源代码](http://code.google.com/p/migratordotnet/source/checkout)。代码结构如下：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/Migrator.Netbug_144AA/image_thumb.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/Migrator.Netbug_144AA/image_2.png)

可以看出,是用了[Provider模式](http://msdn.microsoft.com/en-us/library/ms972319.aspx)，而且已经写好了几个Provider，我用的是Sql Server，已经有了支持，至于如何使用，我会在后面说说吧，如果大家都感兴趣的话，呵呵。

先来看看，Migrator的简单应用吧，增加一个表，删除一个表：
    
    
    [Migration(1)]
    public class _001_AddTable_User : Migration
    {
        public override void Up()
        {
            Database.AddTable("[User]",
                new Column("UserID", System.Data.DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
                new Column("UserName", System.Data.DbType.String, 50, ColumnProperty.NotNull | ColumnProperty.Unique),
                new Column("Password", System.Data.DbType.String, 64, ColumnProperty.NotNull),
                new Column("Email", System.Data.DbType.String, 128, ColumnProperty.NotNull | ColumnProperty.Unique),
                new Column("AddTime", System.Data.DbType.DateTime, ColumnProperty.NotNull, "getDate()"));
        }
    
        public override void Down()
        {
            Database.RemoveTable("[User]");
        }
    }

正如先前所说的，我们加了一个User表，我们的创建表的类，必须继承Migration抽象类，实现Up()和Down()方法，Up是升级，Down是回滚操作。代码可以正确执行，但是当你回滚的时候，虽然提示正确，但是，我们User表始终没有删除，就是上面所说的bug，那我们要看的，就是Database.RemoveTable(tableName)这个方法，通过查看，发现Database是一个抽象对象：TransformationProvider，看名字就知道了，呵呵。看看RemoveTable(tableName)方法吧：
    
    
    public virtual void RemoveTable(string name)
    {
        if (TableExists(name))
            ExecuteNonQuery(String.Format("DROP TABLE {0}", name));
    }

发现了没有，他执行了一个Sql脚本，Drop Table tableName，那这句应该没错，可以排除，但是在运行前有一个TableExists(tableName)的判断，我们再看看：
    
    
    public virtual bool TableExists(string table)
    {
        try
        {
            ExecuteNonQuery("SELECT COUNT(*) FROM " + table);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

运行的Sql脚本是：Select count(*) from tableName

恩？没错嘛，如果是这样运行的话，应该可以查到数据的，返回true才对，慢着，这个方法是virtual，也就是说我们子类Provider可以完全重写。

基本上可以确定是Provider的RemoveTable和TableExists这2个方法中有一个出错了，好的，我们再来看看。

因为我用的是Sql Server，当然只需要看SqlServerTransformationProvider了，看看这2个方法:
    
    
    public override bool TableExists(string table)
    {
        using (IDataReader reader =
            ExecuteQuery(String.Format("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='{0}'", table)))
        {
            return reader.Read();
        }
    }

呵呵，只找到一个TableExists，那说明RemoveTable还是正确的，不过这个TableExists方法有点奇怪，因为运行了：
    
    
    SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='[User]'

这是什么呢？

> MSDN:为当前用户具有权限的当前数据库中的每个表返回一行

我试着把这个语句放到我的Sql Managerment中运行一下，发现没有找到，不过当我去掉中括号后，返回一行记录。

至此，原因找明白了，一个非常非常小的问题：

运行Sql脚本的时候，我们遇到关键字表或者字段的话，MSSQL必须用中括号包围，当然这是一种好的习惯，应该每个字段每个表名都这样做，但是，MSSQL的这个INFORMATION_SCHEMA却在查询的时候，是按照字符串来查询的，不需要这个中括号，这样就产生了冲突。

好了，问题找到了，我们可以自己动手修改一下，但为了简单起见，我就修改他的源代码了，不写一个Provider了。

修改很简单，注释掉SqlServerTransformationProvider的TableExists(table)方法就ok了，编译，然后再console中运行一下卸载的bat（下篇再讲），哈，成功删除User表，问题至此也得到了完美解决。效果图：

[![image](https://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/Migrator.Netbug_144AA/image_thumb_1.png)](http://images.cnblogs.com/cnblogs_com/inday/WindowsLiveWriter/Migrator.Netbug_144AA/image_4.png)

看到Drop Table [User] 了吧，这就是运行的Sql语句，再看看你的数据库，嘿嘿，已经删除了。

# 总结

这次呢，因为项目中正好遇到了这个问题，顺便看了下，还发现了基础小bug，比如对NVarchar(Max)的支持不好，少了MSSQL的Timestamp类型等。不过总体来说，Migrator.Net是一个优秀的数据库迁移框架，有了它，我们大大提高了项目的扩展性，而且对于以后的重构，升级都有很好的帮助，大家也可以去它的讨论区进行讨论。目前这个bug还没有提交给作者，等有时间了，提交下吧。

[点击下载修正过的Migrator.Providers.dll](https://files.cnblogs.com/inday/Migrator.Providers.rar)

