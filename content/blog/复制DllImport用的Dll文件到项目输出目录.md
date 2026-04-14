---
title: "复制DllImport用的Dll文件到项目输出目录"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 复制DllImport用的Dll文件到项目输出目录

> 原文链接: https://www.cnblogs.com/inday/p/include-dll-for-dllimport.html | 迁移自博客园

---

打开项目的csproj文件  
添加如下代码
    
    
     <ItemGroup>
        <None Remove="lib\xxx.dll" />
        <Content Include="lib\xxx.dll">
          <Link>xxx.dll</Link>
          <CopyToOutputDirectory>Always</CopyToOutputDirectory>
        </Content>
      </ItemGroup>
    

