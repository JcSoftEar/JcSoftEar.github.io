---
title: "Sql语句收藏"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# Sql语句收藏

> 原文链接: https://www.cnblogs.com/inday/archive/2008/11/25/1340817.html | 迁移自博客园

---

1、 查询列表，按照In的排序进行排序

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Code  
select *, (select count(0) from [picture] where album_id=[album].id) as piccount From [Album] Where id in (5,6,8,1,3,4) order by charindex(',' + ltrim(rtrim(str(id))) + ',',',5,6,8,1,3,4,')

2、查询不重复结果，按照另外一个字段进行排序

![](https://www.cnblogs.com/Images/OutliningIndicators/ContractedBlock.gif)![](https://www.cnblogs.com/Images/OutliningIndicators/ExpandedBlockStart.gif)Code  
select distinct A,B,max(C)  
From Table  
Group By A, B  
Order By Max(c)

（通常情况在，A，B为用户ID和用户名，但是要按照C：添加时间来进行排序，这时候就要使用这个方法了）

陆续添加中，希望对大家有帮助~

