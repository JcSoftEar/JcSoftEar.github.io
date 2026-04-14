---
title: "struts技术的logic标签"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# struts技术的logic标签

> 原文链接: https://www.cnblogs.com/inday/articles/570009.html | 迁移自博客园

---

## struts技术的logic标签-- -

开源项目最好的是可以让我们从项目的源码本身角度看项目，通过对源码的了解更多的是对设计思想融会贯通达提升整体能力的目的。blog也是一个好的项目，可以让不从事网页制作人们也可以通过简单的配置实现在网上发布文章的目的。先前也用struts做过两个项目，现在只是想从另一个角度来理解它。每天看了一点儿struts的源码，记录下自已的理解。

一、定义标签文件(web.xml)  
  
/tags/struts-logic  
/WEB-INF/struts-logic.tld  


二、引用标签文件(jsp文件)  
< %@ taglib uri="/tags/struts-logic" prefix="logic" %>

三、标签文件说明(struts-logic.tld)  
(1)empty标签  
类名：org.apache.struts.taglib.logic.EmptyTag  
标签体：bodycontent=JSP  
引用logic:empty  
属性 attribute:name,property,scope  
功能：判断对象的值是否为空

(2)equal  
类名：org.apache.struts.taglib.logic.EqualTag  
标签体：bodycontent=JSP  
引用logic:equal  
属性 attribute:cookie,header,name,parameter,property,scope,value  
功能：等于比较符

(3) forward  
org.apache.struts.taglib.logic.ForwardTag  
标签体：bodycontent=empty  
引用logic:forward  
属性 attribute:name  
功能：页面导向，查找配置文件的全局forward

(4) greaterEqual  
类名：org.apache.struts.taglib.logic.GreaterEqualTag  
标签体：bodycontent=JSP  
引用logic:greaterEqual  
属性 attribute:cookie,header,name,parameter,property,scope,value  
功能：大于等于比较符

(5)greaterThan  
类名：org.apache.struts.taglib.logic.GreaterThanTag  
标签体：bodycontent=JSP  
引用logic:greaterThan  
属性 attribute:cookie,header,name,parameter,property,scope,value  
功能：大于比较符

(6) iterator  
类名：org.apache.struts.taglib.logic.IterateTag  
标签体：bodycontent=JSP  
引用logic:iterator  
属性 attribute:collection,id,indexId,length,name,offset,property,scope,type  
功能：显示列表为collection的值（List ,ArrayList,HashMap等）

(7)lessEqual  
类名org.apache.struts.taglib.logic.LessEqualTag  
标签体：bodycontent=JSP  
logic:lessEqual  
属性 attribute:cookie,header,name,parameter,property,scope,value  
功能：小于等于比较符

(8)lessThan  
类名：org.apache.struts.taglib.logic.LessThanTag  
标签体：bodycontent=JSP  
logic:lessThan  
属性 attribute:cookie,header,name,parameter,property,scope,value  
功能：小于比较符

(9)match  
类名：org.apache.struts.taglib.logic.MatchTag  
标签体：bodycontent=JSP  
引用logic:match  
属性 attribute:cookie,header,location,name,parameter,property,scope,value  
功能：比较对象

(10)messagesNotPresent  
类名：org.apache.struts.taglib.logic.MessagesNotPresentTag  
标签：bodycontent=JSP  
引用logic:messagesNotPresent  
属性 attribute:name,property,message  
功能：ActionMessages/ActionErrors对象是否不存在

(11)messagePresent  
类名：org.apache.struts.taglib.logic.MessagesPresentTag  
标签：bodycontent=JSP  
引用logic:messagePresent  
属性 attribute:name,property,message  
功能：ActionMessages/ActionErrors对象是否不存在

(12)notEmpty  
类名：org.apache.struts.taglib.logic.NotEmptyTag  
标签：bodycontent=JSP  
引用logic:notEmpty  
属性 attribute:name,property,scope  
功能：比较对象是否不为空

(13)notEqual  
类名：org.apache.struts.taglib.logic.NotEqualTag  
标签：bodycontent=JSP  
引用logic:notEqual  
属性 attribute:cookie,header,name,parameter,property,scope,value

(14)notMatch  
类名：org.apache.struts.taglib.logic.NotMatchTag  
标签：bodycontent=JSP  
引用logic:notMatch  
属性 attribute:cookie,header,location,name,parameter,property,scope,value  
功能：比较对象是否不相等

(15)notPresent  
类名：org.apache.struts.taglib.logic.NotPresentTag  
标签：bodycontent=JSP  
引用logic:notPresent  
属性 attribute:cookie,header,name,parameter,property,role,scope,user  
功能：request对象传递参数是否不存在

(16)present  
类名:org.apache.struts.taglib.logic.PresentTag  
标签：bodycontent=JSP  
引用logic:present  
属性 attribute:cookie,header,name,parameter,property,role,scope,user  
功能：request对象传递参数是否存在

(17)redirect  
类名：org.apache.struts.taglib.logic.RedirectTag  
标签：bodycontent=JSP  
引用logic:redirect  
属性 attribute:anchor,forward,href,name,page,paramId,paramName,paramProperty,paramScope,property,scope,transaction  
功能；页面转向，可传递参数 

