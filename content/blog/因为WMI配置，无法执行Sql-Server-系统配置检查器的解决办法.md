---
title: "因为WMI配置，无法执行Sql Server 系统配置检查器的解决办法"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 因为WMI配置，无法执行Sql Server 系统配置检查器的解决办法

> 原文链接: https://www.cnblogs.com/inday/archive/2008/09/15/1291260.html | 迁移自博客园

---

今天重装机器，重新要安装sql 2005，遇到了如下问题：

因为WMI配置，无法执行Sql Server 系统配置检查器的解决办法

随即网上搜索了下，办法不多，还好找到个有用的，贴出来给大家。

先建立一个临时文件夹

我这里是c:\temp

然后建立一个FIXWMI.CMD文件

文件内容如下：

@echo on   
cd /d c:\temp   
if not exist %windir%\system32\wbem goto TryInstall   
cd /d %windir%\system32\wbem   
net stop winmgmt   
winmgmt /kill   
if exist Rep_bak rd Rep_bak /s /q   
rename Repository Rep_bak   
for %%i in (*.dll) do RegSvr32 -s %%i   
for %%i in (*.exe) do call :FixSrv %%i   
for %%i in (*.mof,*.mfl) do Mofcomp %%i   
net start winmgmt   
goto End 

:FixSrv   
if /I (%1) == (wbemcntl.exe) goto SkipSrv   
if /I (%1) == (wbemtest.exe) goto SkipSrv   
if /I (%1) == (mofcomp.exe) goto SkipSrv   
%1 /RegServer 

:SkipSrv   
goto End 

:TryInstall   
if not exist wmicore.exe goto End   
wmicore /s   
net start winmgmt   
:End 

运行FIXWMI.CMD，等运行完成就好了

