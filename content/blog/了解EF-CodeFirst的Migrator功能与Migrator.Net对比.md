---
title: "了解EF CodeFirst的Migrator功能与Migrator.Net对比"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 了解EF CodeFirst的Migrator功能与Migrator.Net对比

> 原文链接: https://www.cnblogs.com/inday/p/code-first-feature-migrator-net.html | 迁移自博客园

---

在上一篇【[数据库迁移利器：Migrator.Net](http://www.cnblogs.com/inday/p/migrator-net-first-page.html)】中，很多朋友提到了EF的CodeFirst也有数据库的迁移功能，说来真惭愧，玩了那么多年，至今还未去了解EF，今天来了解下CodeFirst然后与Migrator.Net进行下横向对比。

CodeFirst是EF提供的一种技术手段，使我们从以往的创建数据库后再创建模型变成了只需要关注代码方式进行创模，然后通过EF框架映射到数据库架构并生成。

CodeFirst除了创建新数据库之外，还提供了相应的迁移工具，通过升级和回滚操作相应的更新我们的数据库架构。这些方面都跟我之前介绍的Migrator.Net有异曲同工的作用。

# 创建新数据库并生成初始架构

通过NuGet直接引用EntityFramework，看下以下代码：
    
    
    public class BlogContext : DbContext
        {
            public DbSet<Blog> Blogs { get; set; }
    
            public DbSet<Post> Posts { get; set; }
        }
    
        public class Blog
        {
            public Blog()
            {
                Posts = new List<Post>();
            }
    
            public int BlogId { get; set; }
    
            public string Name { get; set; }
    
            public virtual IEnumerable<Post> Posts { get; set; }
        }
    
        public class Post
        {
            public int PostId { get; set; }
    
            public string Title { get; set; }
    
            public string Content { get; set; }
    
            public virtual Blog Blog { get; set; }
        }

我们创建了Blog和Post模型，通过在BlogContext中注册这2个模型，通过以下代码：
    
    
    class Program
        {
            static void Main(string[] args)
            {
                using (var db = new BlogContext())
                {
                    db.Database.Initialize(true);
                }
    
                Console.WriteLine("Press any key to exit...");
                Console.Read();
            }
        }

运行程序后，我们来看下数据库的变化。这里要说下，在我们数据库连接都没有配置的情况下，默认情况下VS2012使用LocalDB，VS2010使用SqlExpress。LocalDB不支持SqlServer Management Studio进行连接。

使用VS2012的数据连接，我们能看到我们的数据库已经创建，数据库名为命名空间.Context名，这里是CodeFirstMigrator.BlogContext

看下数据库中有哪些东西：[![image](https://images0.cnblogs.com/blog/4871/201404/101449331681510.png)](https://images0.cnblogs.com/blog/4871/201404/101449320289723.png)

Blogs和Posts表就是EF为我们创建的2个模型表，_MigrationHistory就是版本的信息

[![image](https://images0.cnblogs.com/blog/4871/201404/101449337782923.png)](https://images0.cnblogs.com/blog/4871/201404/101449334974709.png)

_MigrationHistory表与Migrator.Net的SchemaInfo表类似，都保存着版本信息，不过_MigrationHistory存储的数据更多一些。

# 更新表字段

我们为Blog模型添加一个Url属性，然后再运行程序，我们发现会报错：

[![image](https://images0.cnblogs.com/blog/4871/201404/101449343259822.png)](https://images0.cnblogs.com/blog/4871/201404/101449340591137.png)

CodeFirst默认情况下，只能为重新创建数据库和表，并不能更新已存在的数据库，我们必须使用CodeFrist的Migrations功能创建迁移版本，再去更新数据库。

首先需要为Context创建迁移

> 在程序包管理控制台中运行：Enable-Migrations

运行后，会在我们的项目解决方案中生成Migrations目录[![image](https://images0.cnblogs.com/blog/4871/201404/101449347623521.png)](https://images0.cnblogs.com/blog/4871/201404/101449345593050.png)

InitialCreate.cs就是我们初始需要创建的脚本，Configuration是一些迁移配置。我们看下InitialCreate的代码：
    
    
    public partial class InitialCreate : DbMigration
        {
            public override void Up()
            {
                CreateTable(
                    "dbo.Blogs",
                    c => new
                        {
                            BlogId = c.Int(nullable: false, identity: true),
                            Name = c.String(),
                        })
                    .PrimaryKey(t => t.BlogId);
                
                CreateTable(
                    "dbo.Posts",
                    c => new
                        {
                            PostId = c.Int(nullable: false, identity: true),
                            Title = c.String(),
                            Content = c.String(),
                            Blog_BlogId = c.Int(),
                        })
                    .PrimaryKey(t => t.PostId)
                    .ForeignKey("dbo.Blogs", t => t.Blog_BlogId)
                    .Index(t => t.Blog_BlogId);
                
            }
            
            public override void Down()
            {
                DropForeignKey("dbo.Posts", "Blog_BlogId", "dbo.Blogs");
                DropIndex("dbo.Posts", new[] { "Blog_BlogId" });
                DropTable("dbo.Posts");
                DropTable("dbo.Blogs");
            }
        }

[](http://11011.net/software/vspaste)发觉了没，跟Migrator.Net及其相像，通过继承DBMigrator类，重写Up和Down方法实现升级或者回滚的响应操作。

回到之前更新的操作，我们使用程序包控制台程序输入：**Add-Migration** AddBlogUrl 

红色为版本命名，需要唯一。

我们在控制台再输入：Update-Database

通过Update-Database后，会更新我们的数据库架构，如图：

[![image](https://images0.cnblogs.com/blog/4871/201404/101449352476907.png)](https://images0.cnblogs.com/blog/4871/201404/101449350436436.png) [![image](https://images0.cnblogs.com/blog/4871/201404/101449359812050.png)](https://images0.cnblogs.com/blog/4871/201404/101449357627349.png)

响应的Blogs表 和_MigrationHistory表都会有所变化。

# 迁移到特定版本（回滚）

CodeFirst通过控制台输入**Update-Database –TargetMigration: 版本名称** 进行指定版本的迁移，例如我们回滚到初始创建时：Update-Database –TargetMigration:InitialCreate

[![image](https://images0.cnblogs.com/blog/4871/201404/101449365591706.png)](https://images0.cnblogs.com/blog/4871/201404/101449362629262.png) [![image](https://images0.cnblogs.com/blog/4871/201404/101449370127633.png)](https://images0.cnblogs.com/blog/4871/201404/101449368097162.png)

我们不需要切换到cmd控制台，直接在VS中就能进行操作，这点还是很方便的。

# 其他环境进行迁移操作

如果需要再其他开发环境中搭建数据库的话，只需要获取最新的项目代码，使用Update-DataBase命令就可以了。如果需要实践到应用环境，则需要通过**Update-Database -Script -SourceMigration: $InitialDatabase -TargetMigration: 版本名称** 生成Sql脚本，提供给DBA进行数据库操作。

您也可以在项目运行开始添加如下操作：
    
    
    Database.SetInitializer(new MigrateDatabaseToLatestVersion<BlogContext, Configuration>()); 

[](http://11011.net/software/vspaste)此操作会自动更新数据库架构到最新版本。

# 与Migrator.Net对比

作为数据库迁移工具来讲，大家都差不多，都能实现数据库架构的迁移，原理也很相近，不过CodeFirst因为是含在EF中，有了微软的支持在VS中使用，而且迁移代码都是自动生成，这个方面大大提高了开发进度。而Migrator.Net一般会新建一个类库，专门作为迁移用，但因为迁移代码都是我们自己完成，所以对码农来说会更新明了。如果数据库复杂度不高的话，随便用哪个都可以，但一般我们的项目会越来越庞大，数据库的更改也会越来越频繁，这时候CodeFirst就会落后于Migrator.Net，CodeFirst会根据您控制台命令Add-Migration生成从之前版本到现在的所有更改，而Migrator.Net则因为我们自己来编写的，会清晰明了，对迁移来说也会更好（个人想法，可能还未深入了解的关系吧）。

|  CodeFirst |  Migrator.Net  
---|---|---  
数据库类型支持 |  默认支持SqlServer,LocalDB,SqlExpress   
通过自己编写代码也能支持其他数据库 |  默认支持：MSSQL，MySql，Sqlite，oracle，PostgreSql  
与VS集成 |  集成度高 |  无集成  
迁移工具 |  通过生成SQL脚本   
命令行工具   
通过项目代码进行自动迁移 |  通过命令行迁移   
也可以在项目中进行自动迁移  
复杂度 |  开发简单，迁移脚本自动生成 |  开发一般，迁移脚本自己编写  
项目耦合度 |  耦合度高，因为是自动生成迁移脚本，需要依赖实体类和上下文。 |  无耦合，迁移脚本自己编写，不需要了解我们的实体类  
数据库特性支持 |  基本支持，遇到特别字段，可通过修改生成的迁移脚本进行修改 |  基本支持  
创建新数据库 |  可自动创建 |  需手动创建  
  
两个功能相似，但在使用上还是各有千秋，做为一个架构师来说，我更偏向于使用Migrator.Net，因为CodeFirst是EF的一种功能，我们的项目有时候不是必须使用EF的。

EF发展到现在已经到6.1版本，肯定已经很强大了，但种种原因至今还未接触过，不知其强大的功能，今后有机会还是希望接触一下。

CodeFirst 参考资料：

**[对新数据库使用 Code First](http://msdn.microsoft.com/zh-cn/data/jj193542)**

**[约定](http://msdn.microsoft.com/zh-cn/data/jj679962)**

**[Code First 迁移](http://msdn.microsoft.com/zh-cn/data/jj591621)**

**[自动化 Code First 迁移](http://msdn.microsoft.com/zh-cn/data/jj554735)**

**[Migrate.exe](http://msdn.microsoft.com/zh-cn/data/jj618307)**

