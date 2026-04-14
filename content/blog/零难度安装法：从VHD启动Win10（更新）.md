---
title: "零难度安装法：从VHD启动Win10（更新）"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 零难度安装法：从VHD启动Win10（更新）

> 原文链接: https://www.cnblogs.com/inday/articles/win10-vhd.html | 迁移自博客园

---

这篇从VHD启动[Win10](http://win10.ithome.com/)的教程是应评论中一些网友的要求发布的，作者是IT之家论坛的MSDN...，大家为他鼓掌吧！

10月4日上午更新：改进启动菜单添加方法，避免低版本系统中制作后从VHD启动提示winload.exe数字签名错误问题。

**玩转Windows10系统盘镜像三板斧** ：

• 下载ISO后，可以用[魔方电脑大师](http://mofang.ithome.com/)（[点击访问官网](http://mofang.ithome.com/)）中的**魔方文件校验** （[点此下载](http://down.ruanmei.com/tweakcube/partner/pcmastersetup_u106_full.exe)）来获取SHA1、MD5、CRC等校验值，确保下载的是官方纯净版，不给木马病毒留机会

• 魔方电脑大师中的**魔方U盘启动** （[点此下载](http://down.ruanmei.com/tweakcube/partner/pcmastersetup_u106_full.exe)）可以把ISO制作成启动U盘来进行安装，既省去了刻盘的麻烦，还可以随手分享给小伙伴

• 魔方电脑大师中的**魔方虚拟光驱** （[点此下载](http://down.ruanmei.com/tweakcube/partner/pcmastersetup_u106_full.exe)），可以把ISO直接虚拟成一个光驱，方便您直接运行安装

VHD是一种虚拟磁盘文件格式，我们可以将系统安装在VHD中，直接从VHD文件启动操作系统。这种启动方式的特点：

一，无制作难度，也不必单独拿一个分区来装系统，对原系统无影响，卸载也很方便。  
二，同样使用虚拟磁盘装系统，但虚拟机安装性能大打折扣。使用此法可以获得与物理机安装几无差别的性能体验。不过，Win10的快速启动机制需要在实体机中安装才能正常运作（VHD中不能休眠），所以此法不适合想要体验快速启动的朋友。有条件的朋友还是建议在实体机中安装，见[Win10预览版全新、双系统安装方法图文详解](http://www.ithome.com/html/win10/106377.htm)。  
三，管理起来比较方便，只需删掉虚拟磁盘和启动菜单即可卸载。卸载方法最后还有提到。  
  
**需注意****：** 此法只适用于在Windows7/8/8.1/10，Windows Server 2008 R2，WinPE 3.0系统下操作，可安装32位或64位。 

**安装步骤：**

①，下载[Windows10](http://win10.ithome.com/)（[下载页面](http://www.ithome.com/html/win10/106334.htm)），打开ISO镜像。注：Win7下可用虚拟光驱加载（[点击下载](http://down.ruanmei.com/tweakcube/partner/pcmastersetup_u106_full.exe)）

②，下载新版本 VHD_OneKey（[前往论坛下载](http://bbs.ithome.com/thread-635796-1-1.html)）

③，打开VHD_OneKey，对照下图，先创建VHD，并将系统映像灌输到VHD。

![](http://img.ithome.com/newsuploadfiles/2014/10/20141003_190011_374.jpg)

**参数说明：**

VHD的位置可以为电脑硬盘上任意位置，但注意所在分区文件系统一定要是NTFS，整个过程不会影响分区中的其他文件；  
VHD的格式可设为动态扩展；  
VHD的大小自己看需要设置，建议最大容量不小于40G。对于动态类型的磁盘此处大小为限定最大容量，实际大小为安装后所有文件所占大小，随着文件数量增多会不断变大，即所谓动态的意思。但请注意，一定要保证分区有足够的剩余空间（剩余空间要大于设定的VHD大小），否则无法正常启动；  
装入VHD的WIM位置选择挂载的镜像中sources下的install.wim文件；  
映像号选择1；

设置好后，点确定。在弹出的确认窗口中点“是”。VHD创建后将自动挂载，系统若弹出对话框提示“格式化后才可用”，不用格式化，取消即可。等待进度达到100%并出现完成提示。

④ 添加启动菜单

如下图，选定刚才创建的VHD，点击“挂载VHD/VHDX”。弹出“只读挂载”提示时点“确定”。

![](http://img.ithome.com/newsuploadfiles/2014/10/20141004_100025_317.jpg)

挂载成功后，点击“向BCD中添加VHD/VHDX 项目”即可。

添加完成后就可以重启了！重启后需要进行一些设置，中间要求输入密钥，NKJFK-GPHP7-G8C3J-P6JXR-HQRJR，也可跳过进入系统后再输密钥激活。

提示：完成上面的步骤正常情况下是没有问题的。如果你从VHD启动时提示winload错误，可以手动添加启动菜单：先按照上图所示挂载VHD。挂载成功后你就能在“计算机”或“这台电脑”中看到一个新的盘，比如是Z盘。以管理员身份运行cmd，输入下面的命令，回车创建启动菜单即可。

bcdboot Z:\Windows /l zh-cn

![](http://img.ithome.com/newsuploadfiles/2014/10/20141004_100039_60.jpg)

安装完成截图一张

![](http://img.ithome.com/newsuploadfiles/2014/10/20141003_190220_789.jpg)

**卸载方法：**

回到你原来的系统中，执行下面两个操作：

1、删除菜单。按Win+R组合快捷键（Win即Windows徽标键）打开运行，输入 msconfig ，点“确定”，打开“系统配置”。在这里删除Win10预览版的启动菜单。

![](http://img.ithome.com/newsuploadfiles/2014/10/20141004_100049_208.jpg)

2、删除VHD文件。

**最后：** 本文根据论坛的《从VHD启动Windows8》一文修改而来。其实所有操作用命令也并不复杂，不过用工具代替很多步骤是非常省事的~~

本文出自IT之家论坛《[从VHD启动 Windows 10](http://bbs.ithome.com/thread-635796-1-1.html)》。

关注[Windows10](http://win10.ithome.com/)，锁定[Win10](http://win10.ithome.com/)之家（[http://win10.ithome.com](http://win10.ithome.com/)）

