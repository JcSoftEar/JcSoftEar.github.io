---
title: "AppFuse项目笔记（1）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# AppFuse项目笔记（1）

> 原文链接: https://www.cnblogs.com/inday/articles/527008.html | 迁移自博客园

---

AppFuse项目笔记（1）  


一、Appfuse简介

Appfuse是Matt Raible 开发的一个指导性的入门级J2EE框架，它对如何集成流行的Spring、Hibernate、ibatis、struts、Xdcolet、junit等基础框架给出了示范，最新的1.7版更是提供了对Taperstry和JSF的支持。在持久层，AppFuse采用了Hibernate O/R映射工具（[http://www.hibernate.org](http://www.hibernate.org/)）；在容器方面，它采用了Spring Framework（[http://www.springframework.org](http://www.springframework.org/)）。用户可以自由选择Struts、Spring/MVC，Webwork，Taperstry、JSF这几个web框架。采用TDD的开发方式，使用JUnit测试各层，甚至测试 jsp 输出的 w/o 错误。为了简化开发，预定义好了一套目录结构、基类、用来创建数据库、配置Tomcat、测试部署应用的 Ant 任务，帮助快速自动生成源程序和自动维护部分配置文件。

参考资料：   
在<https://appfuse.dev.java.net/>可以下载Appfuse，目前的版本是1.7。   
Appfuse的参考资料和文档可以在<http://raibledesigns.com/wiki/Wiki.jsp?page=AppFuse>查看。

二、Appfuse框架快速入门

AppFuse项目的主要目的是帮助开发人员减少在开始一个项目时所要做的工作。以下是使用它新建一个项目的基本步骤：

1、下载或从CVS (cvs -d :pserver:guest@cvs.dev.java.net:/cvs co appfuse)检出appfuse最新版本之源码。

2、安装J2SE 1.4+, 正确设置JAVA_HOME环境变量, 安装Ant 1.6.2+, 设置ANT_HOME环境变量。

3、安装MySQL 3.23.x+ (建议使用 4.1.7版本)和Tomcat 4.1.x+ (建议使用 5.0.28版本)，设置CATALINA_HOME环境变量指向你Tomcat安装目录。

注意: 如果你准备使用MySQL 4.1.7，那么你必须将其默认的字符集设置为UTF-8字符集，并且将其默认的表类型设置为InnoDB类型。也就是说，你要在你的c:\Windows\my.ini 或者/etc/my.cnf 文件中添加以下几行：  
[mysqld]  
default-character-set=utf8  
[mysqld]  
default-table-type=innodb 

4、安装一个本地的SMTP服务器，或者如果你已经有一个可用的SMTP服务器的话，你可以去修改mail.properties (在web/WEB-INF/classes目录下) 和build.properties (在根目录下 -- 为 log4j信息) 以指向你的SMTP服务器 - 默认地它是指向你的本机的SMTP服务器的。

5、将lib/junit3.8.1/junit.jar文件拷贝到$ANT_HOME/lib目录下。

6、执行 ant new -Dapp.name=YOURAPPNAME -Ddb.name=YOURDBNAME 命令。这将创建一个名为“YOURAPPNAME”的目录。

警告: 该命令对于某些app.name值将不执行 - 不要使用 "test"，任何包含 "appfuse" 在其中的名你，或者任何以数字、两个存折号(-) 等等混合出来的名称。 

7、转到新的目录，执行ant的setup任务创建数据库，同时将你的应用发布到Tomcat服务器上。只有当你的root用户没有口令建库的任务才会工作。你也可以在需要的时候打开build.properties文件去更改这root用户的口令。如果你想进行测试并且希望了解是否所有方面均可以工作完好，那么你可以执行ant的test-all任务进行全面的测试 -当然前提是当你做测试的时候先将Tomcat服务器停止。

8、执行ant的test-reports任务 - 当这个任务执行完后，会有一条消息告诉你如何查看那些产生的测试报告。

当你确定你通过以上步骤配置好你的AppFuse开发环境后 - 下面你需要做的事就是学习一下指南来了解如何使用 AppFuse 进行你的开发。 

可选择的安装

如果你愿意选择用iBATIS做为你的持久层框架，请专门去看一下extras/ibatis目录下的 README.txt 文件。   
如果你愿意选择用Spring做为你的WEB层框架，请专门去看一下extras/spring目录下的 README.txt 文件。   
如果你愿意选择用WebWork做为你的WEB层框架，请专门去看一下extras/webwork目录下的 README.txt 文件。   
如果你愿意选择Tapestry做为你的web层框架，请专门去看一下extras/tapestry目录下的 README.txt 文件。   
如果你愿意选择JSF做为你的web层框架，请专门去看一下extras/jsf目录下的 README.txt 文件。   
  
如果你希望你能够通过脚本来自动地完成创建和测试，那么可以参考以下的脚本：   
rm -r ../appfuse-spring  
ant new -Dapp.name=appfuse-spring -Ddb.name=ibatis  
cd ../appfuse-spring  
ant install-ibatis install-springmvc  
cd extras/ibatis  
ant uninstall-hibernate  
cd ../..  
ant setup   
ant test-all test-reports 

如果你并不想安装iBATIS, Spring MVC 或者 WebWork，在你将你的项目放入代码控制仓库前你应该删除掉它们在extras目录中的安装内容。 

\--------------------------------------------------------------------------------

  
通常当你完成了以上所有步骤并使它们可以工作后，最可能的事是你会希望把“org.appfuse”包名，改为类似“com.company”这样的包名。现在做这件事已经非常简单了，所有你需要做的事就是下载一个改包名的工具，看看它的README文件，以了解它的安装和使用。

注意: 使用这个工具前你最好是将你的项目做一个备份，从而保证能够恢复它。 

如果你将org.appfuse.webapp.form包改为如test.web.form这样的包名，你得同时去修改一下src/service包中的ConverterUtil类，getOpposingObject方法是你的朋友，让我们来看一下： 

name = StringUtils.replace(name, "model", "webapp.form");  
name = StringUtils.replace(name, "webapp.form", "model"); 

三、AppFuse 开发指南

如果你已经下载了AppFuse并且想在你的机器上安装它，你最好按照快速入门中的步骤进行安装。一旦你已经将所有的内容安装好后，以下的指南是你学习如何使用AppFuse进行开发的最好的教程。 

注意: 这个开发指南在AppFuse的发布版本中同样包含一份，如果你想更新在你的工程中的那份拷贝（它在docs目录中），可以通过执行 "ant wiki"来完成。 

对于AppFuse 1.6.1, 你能够本指南中告诉你的方法生成大部分代码。如果你正在使用的是Struts+Hibernate这样一个组合，你甚至可以完全生成它们。而如果你的web层框架选择了Spring或者WebWork就不那么幸运了, 对于它们来说要写一个自动化的安装脚本存在许多困难，所以你就不得不自己动手来配置那些Controllers和Actions了。这主要是因为我没有对这些web层框架使用XDoclet，同时也是由于使用Ant工具作为安装工具的局限性所致。自动生成代码的工具我称之为 AppGen ，我在 Part I 中讲解如何使用它。

Part I: 在AppFuse中创建新的 DAOs 和对象 - 这是一个关于如何创建一个基于数据为中表的Java对象以及如何创建Java类从而持久化对象到数据库中的教程。

1、关于这个指南：

本指南将向你展示如何在数据库中创建一个新的表，以及如何创建访问这个表的Java代码。 

我们将创建一个对象和一些其他的类来将这个对象持久化（保存、装载、删除）到数据库中。用 Java 的语言来说，我们称这个对象是一个POJO对象（Plain Old Java Object ），这个对象基本上与数据库中的某张表是相对应的，其他的类将是： 

一个数据访问对象（也称为是一个DAO），一个接口，一个 Hibernate 实现类。   
一个 JUnit 类，用来测试我们的 DAO 对象是否可以正确工作。   
注意:如果你是在使用 MySQL 并且如果你想要使用事务 (一般说来你肯定会选择使用的)，那么你必须将 table-type设置为 InnoDB。你可以这样做，将下面的内容加到你的 mysql 配置文件 (/etc/my.cnf or c:\Windows\my.ini) 中。第二个设置（用来设置UTF-8字符集）是mysql 4.1.7+所需要的。 

[mysqld]  
default-table-type=innodb  
default-character-set=utf8

如果你使用 PostgreSQL 遇到批处理发生混淆的错误，可以试着在你的src/dao/**/hibernate/applicationContext-hibernate.xml文件中加入0配置来关闭批处理。 

  
AppFuse 使用 Hibernate 作为它默认的持久层。 Hibernate 是一个对象关系映射框架，它使你将你的Java对象与数据库的表建立起一种映射。使你可以很容易地在你的对象上执行CRUD (Create, Retrieve, Update, Delete) 操作。

你也同样可以使用iBATIS 作为持久层的另一个可能的选择。如果要在 AppFuse安装iBATIS，请看一下extras/ibatis目录中的 README.txt 文件。如果你想用 iBATIS 替换 Hibernate，我希望你是有足够的理由并且你应该对它是熟悉的。我也希望你能够针对如何在AppFuse中使用iBATIS 为本指南提出好的建议。 ;-) 

下面我将用文字来告诉你在实际的开发过程中我是如何做的。  
让我们从在AppFuse项目结构中创建一个新的对象，一个DAO和一个测试用例来开始。

内容列表

[1] 创建一个新的对象并且加入 XDoclet 标签  
[2] 使用Ant，基于我们新建的对象创建一个新的数据库表   
[3] 创建一个新的 DAOTest 以便对于DAO 进行JUnit测试   
[4] 创建一个新的 DAO 对于我们这个对象执行 CRUD 操作   
[5] 为Person对象和PersonDAO配置Spring配置文件  
[6] 运行 DAOTest 进行测试

[1] 创建一个新的对象并且加入 XDoclet 标签

我们需要做的第一件事就是创建一个对象去持久化它。让我们创建一个简单 "Person" 对象 (创建到 src/dao/**/model 目录中) ，我们让它有一个 id, 一个 firstName 和一个 lastName (作为这个对象的属性)。

package org.appfuse.model;

public class Person extends BaseObject {  
private Long id;  
private String firstName;  
private String lastName;

/*  
Generate your getters and setters using your favorite IDE:   
In Eclipse:  
Right-click -> Source -> Generate Getters and Setters  
*/  
} 

这个类应该继承自 BaseObject,由于BaseObject有 3 个抽象方法: (equals(), hashCode() and toString()) ，所以你必须在这个Person类中实现它们。前两个方法是 Hibernate 要求的，最简单的方法是使用工具（如：Commonclipse）来完成它，如果你想知道关于使用这个工具的更多的信息你可以去Lee Grey的网站去找。另外一个你可以使用的工具是Commons4E，它是一个 Eclipse Plugin ，我没有用过，所以我无法告诉你它有什么功能。 

  
如果你使用的是 IntelliJ IDEA ，你可以生成 equals() 和 hashCode()，但是生成不了 toString()，当然有一个 ToStringPlugin，但我从来没有亲自用过。 

现在我们已经有了一个创建好的 POJO ，我们需要在里面加上 XDoclet 标签以便由它生成 Hibernate 映射文件。这个映射文件是让 Hibernate 来映射对象到表，映射属性到表的列的。

首先，我们加入一个 @hibernate.class 标签，这个标签告诉 Hibernate 这个对象将映射哪一张表： 

/**  
* @hibernate.class table="person"  
*/  
public class Person extends BaseObject { 

我们也必须加一个主键映射，否则当生成映射文件的时候XDoclet将出现错误。注意所有这些@hibernate.* 标签应该放置在你的POJO对象的 getter方法的 Javadocs 位置。 

/**  
* @return Returns the id.  
* @hibernate.id column="id"  
* generator-class="increment" unsaved-value="null"  
*/

public Long getId() {  
return this.id;  
} 

我使用 generator-class="increment" 代替 generate-class="native" ，因为我发现当在其他一些数据库上使用"native"时存在一些问题。如果你只打算使用MySQL，我推荐你使用"native"，而我们的这个指南使用“increment”。

[2] 使用Ant，基于我们新建的对象创建一个新的数据库表 

你可以通过运行"ant setup-db"来创建person表。这个任务创建一方面会创建Person.hbm.xml文件，另一方面可以在数据库中创建一张"person"表。从ant的控制台，你可以看到Hibernate为你创建的表模型：

[schemaexport] create table person (  
[schemaexport] id bigint not null,  
[schemaexport] primary key (id)  
[schemaexport] );  


如果你想看一下Hibernate为你生成的 Person.hbm.xml 文件的内容，你可以去 build/dao/gen/**/model 目录去看，下面我列出其内容：

  
"-//Hibernate/Hibernate Mapping DTD 2.0//EN"   
"<http://hibernate.sourceforge.net/hibernate-mapping-2.0.dtd>">

  
name="org.appfuse.model.Person"  
table="person"  
dynamic-update="false"  
dynamic-insert="false"  
>

name="id"  
column="id"  
type="java.lang.Long"  
unsaved-value="null"  
>

