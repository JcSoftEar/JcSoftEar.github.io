---
title: "【强烈推荐】数据库迁移利器：Migrator.Net"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 【强烈推荐】数据库迁移利器：Migrator.Net

> 原文链接: https://www.cnblogs.com/inday/p/migrator-net-first-page.html | 迁移自博客园

---

# 简介

很郁闷，写了一天的遇到LiveWriter错误，可恶啊

几年前在做项目中第一次接触到了[Migrator.Net](https://github.com/migratordotnet/Migrator.NET)，就深深被吸引住了，至此以后在新的大项目中，我都会使用Migrator.Net来创建或者更新数据库架构。曾经在项目中也发现了[小bug](http://www.cnblogs.com/inday/archive/2009/10/26/Migrator-Net-Bug.html)并提交给了作者，当时还是有点小激动啊。几年过去了，Migrator.Net虽然已经迁移到了github上，但作者好像从3年前就不再更新了，不过这不影响我对它的喜爱，一如既往的使用着它，它的出现让我对数据库这块彻底的放开，不用手动去创建表，不用手动的去创建索引，一切就这么简单。

目前Migrator.Net原生代码支持：MsSql，Oracle，PostgreSql，Sqlite，MySql。当然您也可以继承其几个抽象类，完成对其他数据库的支持。使用 Migrator.Net,您可以不用关注使用的是什么类型数据库，数据库之间的迁移也很方便，我们只要关注的是我需要哪些表，哪些字段，哪些索引，哪些关联。

您是否碰到过在项目成熟后，新来的CTO要改变数据库类型，或者重新独立数据库，又或者数据的越来越大，更新更好的数据库呢？这时候作为码农的我们是最头大的时候，因为我可能是在中途接手的项目，也有可能是几年前设计的数据库，鬼知道要做些什么工作啊！为了吃饭，不得不重新研究数据库，不更改数据库类型还好，导出脚本即可，遇到更改数据库类型，天呐~~~有了Migrator.Net，以后您就不需要再有这个担心了，交给他来吧！

# 准备工作

目前Migrator.Net已经更新至0.9.1版本，您可以通过NuGet管理器下载其相关Dll到您的项目中。最好您也下载其源代码：<https://github.com/migratordotnet/Migrator.NET>

为了帮助VS2012以前版本的朋友，我打包一下所需的工具及dll，[点击下载](https://files.cnblogs.com/inday/Migrator.Net.rar)。

下载源代码后，我们看一下他有3个主项目

[![image](https://images0.cnblogs.com/blog/4871/201404/081208150433438.png)](https://images0.cnblogs.com/blog/4871/201404/081208147783751.png)

Migrator.Framework 我们编写数据库结构时所需要用到的框架

Migrator.Providers 提供了对各个数据库的支持

Migrator 这个就是最终运行升级、回滚操作的类库。

准备工作做好，我们来看下如何创建新表

# 创建新表

我这次还是用上一篇FluentNhibernate中的数据表，直接看代码，很好理解的：
    
    
    [Migration(1)]
        public class _001_AddTable_Store : Migration
        {
            public override void Down()
            {
                Database.RemoveTable("Store");
            }
    
            public override void Up()
            {
                Database.AddTable("Store",
                    new Column("Id", DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
                    new Column("Name", DbType.String, 100, ColumnProperty.NotNull));
            }
        }

我们所有需要Migrator.Net控制的，都需要继承Migration抽象类，实现Down和Up方法，还需要在类特性中使用MigrationAttribute指定版本号。Migrator.Net在运行时，会根据指定的版本号进行升级或者回滚操作。

Migration.Up：版本升级时所需的操作

Migration.Down：版本回滚时所需的操作

Database.AddTable：创建新表

Column：列表类，通过指定列名、类型、长度、列属性创建新列

ColumnProperty：列属性
    
    
    [Flags]
        public enum ColumnProperty
        {
            None = 0,
            Null = 1,
            NotNull = 2,
            Identity = 4,
            Unique = 8,
            Indexed = 16,
            Unsigned = 32,
            ForeignKey = 33,
            PrimaryKey = 98,
            PrimaryKeyWithIdentity = 102,
        }

[](http://11011.net/software/vspaste)对应的都是数据库中列的一些属性，大家应该可以看懂吧

Database.RemoveTable：删除某个表

Up和Down一般都是一一对应的，增加个表，删除个表，增加约束，删除约束等等。

> 小贴士：建议大家版本号一定要递增，所以在版本类中，我们可以使用“版本号_操作_表名”来命名文件，比如：001_AddTable_Store.cs

接下来我们再创建一个Employee表：
    
    
    [Migration(2)]
        public class _002_AddTable_Employee : Migration
        {
            private const string tablename = "Employee";
    
            public override void Up()
            {
                Database.AddTable(tablename, 
                    new Column("Id", DbType.Int32, ColumnProperty.PrimaryKeyWithIdentity),
                    new Column("LastName", DbType.String, 50, ColumnProperty.NotNull),
                    new Column("FirstName", DbType.String,50, ColumnProperty.NotNull),
                    new Column("Store_Id", DbType.Int32, ColumnProperty.NotNull));
    
                Database.AddForeignKey("FK_Employee_Store",
                    "Employee", "Store_Id",
                    "Store", "Id");
            }
    
            public override void Down()
            {
                Database.RemoveForeignKey(tablename, "FK_Employee_Store");
                Database.RemoveTable(tablename);
            }
        }

在这个版本中，我们使用了Database.AddForeignKey使Employee表与Store表有了关联。除了之前介绍的AddTable和RemoveTable之外，还有以下常用方法：

ITransformationProvider.AddForeignKey 添加关系

ITransformationProvider.RemoveForeignKey 移除关系

ITransformationProvider.AddCheckConstraint 添加约束

ITransformationProvider.AddUniqueConstraint 添加唯一约束

ITransformationProvider.RemoveConstraint 移除约束

ITransformationProvider.AddPrimaryKey 添加主键

ITransformationProvider.AddColumn 添加列

ITransformationProvider.RemoveColumn 移除列

在删除某个表时，请先清除其约束、关系，否则无法删除。

ok，基本了解后，我们来运行一下

# 运行

你可以自己写个运行程序，使用Migrator类库中的方法，也可以使用作者已经写好的一个控制台程序进行版本控制。项目所在位置：

[![image](https://images0.cnblogs.com/blog/4871/201404/081208154816136.png)](https://images0.cnblogs.com/blog/4871/201404/081208152785665.png)

使用以下命令运行数据迁移：

Migrator.Console.exe SqlServer2005 "Data Source=.;Initial Catalog=MigratorDemo;Integrated Security=SSPI" DataBaseDemo.dll -version 2

蓝色：数据库类型，对应的是Migrator.Providers.Dialect的子类

红色：数据库连接字符串

橙色：程序集文件名

绿色：版本号，如果忽略将会更新到最新版本，通过-version可以升级和回滚操作。

> 小贴士：为了项目方便，我把命令写在了bat文件里，方便升级和回滚，您可以[点击下载](https://files.cnblogs.com/inday/Migrator.Net.rar)我的工具包

在运行前，我们需要用SqlServer Management Studio连接到数据库，创建一个新的数据库：MigratorDemo

运行以上命令，如果一切顺利，您将看到如下界面：

[![image](https://images0.cnblogs.com/blog/4871/201404/081208162789493.png)](https://images0.cnblogs.com/blog/4871/201404/081208158728551.png)

我们看下Migrator.Net在数据库中创建了什么？

[![image](https://images0.cnblogs.com/blog/4871/201404/081208166841436.png)](https://images0.cnblogs.com/blog/4871/201404/081208165285950.png) [![image](https://images0.cnblogs.com/blog/4871/201404/081208170287864.png)](https://images0.cnblogs.com/blog/4871/201404/081208168569149.png)

除了我们创建的2个表之外，另外还有一个SchemaInfo表，其中记录了所有的版本信息，请不要手动操作该表。

# 更新Table

很多时候，我们会不断的更新我们的Table，使其适应我们不断变更的项目。以往我们在更新表格的时候，都会去数据库进行操作，为了我们的应用环境，我们都会写成脚本再去更新，现在有了Migrator.Net我们只需要创建一个升级版本，让它帮我们去更新table，就算遇到错误，因为使用了事务控制，在升级中出现问题也会及时回滚。

接下来我们为Employee表格添加年龄字段：
    
    
    [Migration(3)]
        public class _003_AddColumn_Employee : Migration
        {
            private const string tablename = "Employee";
    
            public override void Up()
            {
                Database.AddColumn(tablename, 
                    new Column("Age", DbType.Byte, ColumnProperty.NotNull, 0));
            }
    
            public override void Down()
            {
                
            }
        }

通过AddColumn添加表，这里注意下，在Down方法中，我并未对应使用RemoveColumn，是因为在项目中，我添加表和添加表字段中间会发生多次数据库操作，在添加字段后，也会对数据库进行多次操作，所以为了数据库数据不遗失，我这里的Down操作没有添加任何动作，这样只当RemoveTable的时候才会删除这个表的所有数据。当然这个也要按照你的实际情况来，不能一概而就的。

红色0是这个字段的默认值，因为有时候添加字段的时候，这个表已经产生数据，而字段又是非可空类型，这时候您必须添加默认值，否则运行会失败。

运行下，我们看下数据库是否相应进行了改变：

[![image](https://images0.cnblogs.com/blog/4871/201404/081208174181279.png)](https://images0.cnblogs.com/blog/4871/201404/081208172159807.png) [![image](https://images0.cnblogs.com/blog/4871/201404/081208179038963.png)](https://images0.cnblogs.com/blog/4871/201404/081208176533506.png)

我们看到Employee表已经成功添加了Age字段，SchemaInfo表也相应的添加了版本号3

# 回滚

有时候我们在开发项目时，会经常对数据库进行改动，但改动后又会感觉不好，再去回滚，在以前我们都会去数据库进行操作，现在我们只要用回滚操作就可以了，我们只需要指定需要回滚到的版本号即可，我们试着回滚到version 1

Migrator.Console.exe SqlServer2005 "Data Source=.;Initial Catalog=MigratorDemo;Integrated Security=SSPI" DataBaseDemo.dll –vsersion 1

运行以上命令，然后查看下数据库的改变：

[![image](https://images0.cnblogs.com/blog/4871/201404/081208183407364.png)](https://images0.cnblogs.com/blog/4871/201404/081208181847177.png) [![image](https://images0.cnblogs.com/blog/4871/201404/081208187626833.png)](https://images0.cnblogs.com/blog/4871/201404/081208185284606.png)

看到了吧，利用Migrator.Net，一切都是如此简单。

# 有了Migrator.Net是否不需要DBA了？

答案肯定是否定的。Migrator.Net只是方便了我们的数据库迁移工作，并不能代替DBA的工作，DBA还需要进行很多数据库相关的工作，这是Migrator.Net无法代替的。

在项目中，我建议DBA先行设计数据库架构，再通过码农进行代码编写，双方相互合作。

# Migrator.Net给我们带来了什么？

给我们带来了什么？这个话题不太好说，至少对于我来说，我不需要关心数据库迁移产生的问题，我只需要关注我的项目开发这块了，利用Migrator.Net再配合ORM工具，我都不用去关心数据库类型不同产生的问题了。

今天给大家带来这个工具，虽说已经是个老工具了，但用起来还是杠杠滴，现在通过Nuget你搜索Migrator会搜出很多，但基本原理都差不多。Migrator.Net也开放了很多接口，我们可以通过自己编写代码让其适应我们的项目，比如数据库表创建后添加一些静态数据等。

大家应该用过一些开源项目，通过web安装方式安装数据库、配置文件等，一般都是运行编写好的Sql语句，有了Migrator.Net，通过其一些接口方法，我们同样可以利用Web方式运行操作。

# 写在最后

Migrator.Net虽说是个好工具，但是否使用还得看您的项目，如果项目已经开始到一半或者接近尾声，那使用他也未必可以为您带来好处，但如果项目人员流动性比较大的话，还是建议您写一个迁移类库，以免造成新人对适应环境所造成的时间损失。

原本清明前写好的，因为自己的不小心，只得重新来过，呵呵。希望这篇教程能给您带来帮助。

最近看了2则新闻，相信大家都应该知道：

### [7岁捐肾救母男孩离世 妈妈眼含热泪接受手术](http://news.qq.com/a/20140403/014152.htm)

看到这则新闻，真的很痛心，我刚当父亲不久，宝宝的发烧都会时时牵动我的心。这个男孩救母的行为真心打动了我。孩子的妈妈也不容易，真的无法想想这个妈妈在接受手术时是个什么样的心情。希望这个妈妈为她的孩子继续活着！

### [11岁女孩独自照顾82岁奶奶3个妹妹和2个患病叔伯](http://news.qq.com/a/20140403/007270.htm)

小女孩真懂事，这是世界太多的不公平，但她还能笑着面对。我们的红x会，福利机构统统马航，作为一个普通的IT屌丝，希望通过自己的绵薄之力赞助其学业。但是新闻上没有公布任何其信息，所以希望在此通过大家帮我寻找下，目前的信息为：张雪群 泸州市纳溪区合面镇马桥村

如果有小女孩消息的，请直接联系我，QQ：785418

