---
title: "linux安全设置小技巧"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# linux安全设置小技巧

> 原文链接: https://www.cnblogs.com/inday/articles/539497.html | 迁移自博客园

---

作者： 紫色焰火 发布时间：2005-8-25 11:34:42 文章来源：华夏 本文已经阅读99次   
服务器的安全 (防范于未然 比入侵后再修补漏洞要好的多 一旦遭到入侵以后 当你发现你的水平在黑客的水平之下  
话 最好重装系统 并且更新你软件的版本为最新的) 注明 : 如果没有查出被入侵的原因 和对方使用什么漏洞以及路径  
重装系统也是于事无补 

需要注意的地方:

1.使用 复杂的口令( 都是废话 但是却是 非常关键的 很多资料都谈到了 我也不必再重复)

使用 chage -M 60 用户名  
来设置 60 天为口令的最长有效期  
并且要设置 一个验证模块 pam_cracklib.so 

这个模块 是用来检查 口令强度 它会调用 cracklib 来测试口令是否会被破解   
它会检查 你的口令  
1是不是和原来的口令一样 或者只是变换了大小写   
2检查口令是否太短   
3 口令是否和原来的相像  
只要 把 /etc/pam.d/passwd  
文件中的 添加 passwor required pam_cracklib.so retry=3 minlength=12 difok=5  
retry=3 就是给用户3次机会设置口令 并且长度至少为12 至少要有5个字符和旧口令不同  
password required pam_cracklib.so retry=3 minlen=12 difok=3  
password required pam_unix.so use_authtok nullok md5

  
2.屏弃 不安全的连接方式 : telnet 以及 ftp 都是不安全的连接方式 ( 尽量采用 ssh 和sftp 等等  
有加密的通讯方式 防止通讯数据被人嗅探或者截获)

  
3\. 对敏感文件的权限设置 必须非常谨慎:  
日志文件 首先创建一个用户组: groupadd logs  
进入日志目录: /var/log  
把所有的文件都归进 logs用户组 chgrp -R logs .  
把所有目录的权限都 设置为 rwxr-x--- 就是750   
所有的文件设置为 rw-r----- 就是640  
chmod -R 700 /etc/rc.d/init.d/*   
这表示只有root才允许读、写、执行该目录下的script文件。

hosts.deny hosts.allow

{控制台访问安全   
1、取消普通用户的控制台访问权限，你应该取消普通用户的控制台访问权限。   
比如shutdown、reboot、halt等命令。   
# rm -f /etc/security/console.apps/   
是你要注销的程序名。   
2、不允许从不同的控制台进行root登陆   
"/etc/securetty"文件允许你定义root用户可以从那个TTY设备登陆。你可以编辑"/etc/securetty"文件，再不需要登陆的TTY设备前添加“#”标志，来禁止从该TTY设备进行root登陆。   
在/etc/inittab文件中有如下一段话：   
# Run gettys in standard runlevels   
1:2345:respawn:/sbin/mingetty tty1   
2:2345:respawn:/sbin/mingetty tty2   
#3:2345:respawn:/sbin/mingetty tty3   
#4:2345:respawn:/sbin/mingetty tty4   
#5:2345:respawn:/sbin/mingetty tty5   
#6:2345:respawn:/sbin/mingetty tty6   
系统默认的可以使用6个控制台，即Alt+F1,Alt+F2...，这里在3，4，5，6前面加上“#”，注释该句话，这样现在只有两个控制台可供使用，最好保留两个。然后重新启动init进程，改动即可生效！} 

  
修改 /etc/ssh/sshd_config   
里的   
PermitRootLogin yes 修改为 no  
这样就能防止 root 直接远程登陆

如果 不希望 用口令验证来登陆 可以选择 基于密钥的登陆方式  
将以下配置做一下简单的修改：  
#AuthorizedKeysFile .ssh/authorized_keys 将#注释去掉  
该选项用于设置用户公钥文件存储位置，系统默认位置在用户目录下的.ssh/authorized_keys

#PasswordAuthentication yes 将#去掉，并将yes改成no  
系统默认使用基于密码的验证方式，这样就禁止了使用基于密码验证方式，而改成了基于密钥的验证方式，从而提高了系统的安全性  
2\. 密钥制作具体的过程  
(1) 添加远程登陆用户  
# adduser remoter  
# passwd remoter //为reomter设置密码,我在我把密码设为fire  
# su –l remoter   
$ ssh-keygen -t rsa  
Generating public/private rsa key pair.  
Enter file in which to save the key (/home/remoter/.ssh/id_rsa): 密钥保存的路径  
Created directory '/home/remoter/.ssh'.  
Enter passphrase (empty for no passphrase): 输入密钥密码,在此我设为fire  
Enter same passphrase again:  
Your identification has been saved in /home/remoter/.ssh/id_rsa. 私钥密码保存径  
Your public key has been saved in /home/remoter/.ssh/id_rsa.pub. 公钥密码保存路径  
The key fingerprint is:  
ff:50:a6:95:5d:1a:39:96:14:f7:e6:7f:91:ea:6f:b4 [reomter@linuxhero](mailto:reomter@linuxhero) 密码指纹  
(2)重命名公钥  
$ ls –al 可以看到在/home/reomter/目录下有一个.ssh文件，进入该目录，  
$ cd .ssh  
$ mv id_rsa.pub authorized_keys 将其重命名与以下修改的配置文件一至,注意不要拼写错  
（3）将私钥下载到本地。  
可以利用remoter相应的FTP用户名和密码登陆，将id_rsa下载到本地.  
再使用puttygen.exe处理用户私钥。运行”puttygen.exe”点击”load”选取开始下载的id_rsa，  
系统要求输入私钥密码输入，如图所示，  
在这里我输入的私钥密码为fire.  
输入密码后，单击确定再点点save private key按钮，将密钥保存为id.ppk.  
(4)基于密钥的远程登陆  
运行putty.exe , 选择“Session",在"HostName(orIP address)"输入IP：192.168.0.20,port:22  
再选择"Connection",选“SSH”->"Auth"->"Browse"选取开始转换过来的密钥,单击"Open

输入用户名:reomter,密码为fire,是私钥密码，而不是系统用用户密码.  
3\. SSH服务配置文件的详细介绍  
#Port 22 指定的SSHD使用的端口，为了安全你还可以在此修改默认端口  
#Protocol 2,1 指定优先使用的SSH协议  
#ListenAddress 0.0.0.0 使用的IP地址（IPV4格式）  
#ListenAddress :: 使用的IP地址 （IPV6格式）

# HostKey for protocol version 1 使用SSH1协议的密钥  
#HostKey /etc/ssh/ssh_host_key SSH1密钥的保存路径  
# HostKeys for protocol version 2 使用SSH2协议的密钥  
#HostKey /etc/ssh/ssh_host_rsa_key SSH2协议rsa密钥保存路径  
#HostKey /etc/ssh/ssh_host_dsa_key SSH2协议dsa密钥的保存路径

# Lifetime and size of ephemeral version 1 server key SSH1服务器密钥的生命周期  
#KeyRegenerationInterval 3600 密钥重建周期，单位为秒  
#ServerKeyBits 768 服务器密钥的长度

# Logging 日志  
#obsoletes QuietMode and FascistLogging  
#SyslogFacility AUTH 日志方式  
SyslogFacility AUTHPRIV 日志方式  
#LogLevel INFO 日志等级

# Authentication:

#LoginGraceTime 120 登陆延时  
#PermitRootLogin yes 禁止root用户登陆  
#StrictModes yes 严格模式

#RSAAuthentication yes RSA验证  
#PubkeyAuthentication yes 公钥验证  
#AuthorizedKeysFile .ssh/authorized_keys 密钥存放路径

# rhosts authentication should not be used 禁止rhosts验证模式  
#RhostsAuthentication no rhosts验证模式  
# Don't read the user's ~/.rhosts and ~/.shosts files 不读取用户的~/.rhosts and ~/.shosts 文件

#IgnoreRhosts yes 忽略Rhosts

# To disable tunneled clear text passwords, change to no here!  
#PasswordAuthentication yes 基于密码的验证模式  
#PermitEmptyPasswords no 允许空密码

4.对一些关键的 切换命令 比如 su mount ..等等 要严加控制 其使用权限 (su 需要指定专门的用户才可以使用 防止}  
暴力破解 mount 防止 有人通过远程挂载 一些 目录 上面suid 和sgid 的 程序 用于入侵或者攻击)

禁止任何人通过su命令改变为root用户   
su(Substitute User替代用户)命令允许你成为系统中其他已存在的用户。如果你不希望任何人通过su命令改变为root用户或对某些用户限制使用su命令，你可以在su配置文件（在"/etc/pam.d/"目录下）的开头添加下面两行：   
编辑su文件(vi /etc/pam.d/su)，在开头添加下面两行：   
auth sufficient /lib/security/pam_rootok.so debug   
auth required /lib/security/Pam_wheel.so group=wheel   
这表明只有"wheel"组的成员可以使用su命令成为root用户。你可以把用户添加到"wheel"组，以使它可以使用su命令成为root用户。  
还可以把su 命令归进 专门的用户组和用户 同样达到这样的效果

防止 有人通过远程挂载 一些 目录 上面suid 和sgid 的 程序 用于入侵或者攻击  
修改/etc/fstab  
只给分区必须的权限  
像这样LABEL=/bakups /bakups ext3 nosuid,noexec 1 2

noexec表示不能在这个分区运行程序，nosuid不能使用nosuid的程序，根据情况自行设置其他分区，一般来说/tmp,/usr都要nosuid

  
5.经常的更新 和升级软件的版本 ( 但是注意 盲目的升级软件版本 很可能会造成新的软件 运行不正常)  
redhat 有可以从 redhat network 获得 更新的功能 使用 up2date 就可以更新系统的各类服务的数据包

  
6.sudo 的设置 ( 这个工具是授权 非root用户 运行root 用户的一些命令)

7.suid 和sgid 位的设置 ( 这个的危害 恐怕是非常严重的 )  
suid 位和sgid 位的设置 chmod u+s 文件 和chmod g+s 文件  
查找 suid 位的文件的命令:   
# find / -type f \\( -perm -04000 -o -perm -02000 \\) \\-exec ls -lg {} \;  
禁止其中不必要的程序: 

\----# chmod a-s program_name 

  
umask 命令 

  
8.各种服务配置文件的设置 (卸载 自己没有开设的服务的数据包 不要保留 )

  
9.为了防止dns欺骗 要对的设置 进行修改 必须 让服务器 进行反相解析 并且要 设置为 先从 外部dns服务器上  
获得数据 不要 设置为 直接读取自己机子的缓存信息  
修改"/etc/host.conf"文件   
"/etc/host.conf"说明了如何解析地址。编辑"/etc/host.conf"文件（vi /etc/host.conf），加入下面这行：   
# Lookup names via DNS first then fall back to /etc/hosts.   
order bind,hosts   
# We have machines with multiple IP addresses.   
multi on   
# Check for IP address spoofing.   
nospoof on   
第一项设置首先通过DNS解析IP地址，然后通过hosts文件解析。第二项设置检测是否"/etc/hosts"文件中的  
主机是否拥有多个IP地址（比如有多个以太口网卡）。第三项设置说明要注意对本机未经许可的电子欺骗。 

  
10.最好可以使用 vpn 来替代 利用外部网络直接连接 远程服务器 

11\. hosts.deny hosts.allow 文件 阻挡 非授权用户访问系统服务  
第一步：   
编辑hosts.deny文件（vi /etc/hosts.deny），加入下面这行   
# Deny access to everyone.   
ALL: [ALL@ALL](mailto:ALL@ALL), PARANOID   
这表明除非该地址包好在允许访问的主机列表中，否则阻塞所有的服务和地址。   
第二步：   
编辑hosts.allow文件（vi /etc/hosts.allow），加入允许访问的主机列表，比如：   
ftp: 202.54.15.99 foo.com   
202.54.15.99和 foo.com是允许访问ftp服务的ip地址和主机名称。 

tcpdchk程序是tepd wrapper设置检查程序。它用来检查你的tcp   
wrapper设置，并报告发现的潜在的和真实的问题。设置完后，运行下面这个命令：   
[Root@kapil /]# tcpdchk 

  
12.iptables 防火墙设置 (这里需要严格设置 并且要设置 关键文件的权限 同时在这里 在保证安全的前提下  
尽量少的 规则可以提高效率和处理速度 对出口数据同样要严格控制 防止反相连接 或者成为别人dos 攻击的发源  
地 !)

#输出链允许源地址是xxx.xxx.xxx.xxx的数据输出，也可以指定网卡例： –i eth0 (防止成为别人dos 攻击的发源  
地 !)  
iptables -A OUTPUT -s xxx.xxx.xxx.xxx -j ACCEPT  
#限制ping包每一秒钟一个，10个后开始  
iptables -A INPUT -p icmp -d xxx.xxx.xxx.xxx -m limit --limit 1/s --limit-burst 10 -j ACCEPT

#限制IP碎片，每秒钟只允许100个碎片，防止DoS攻击  
iptables -A INPUT -f -m limit --limit 100/s --limit-burst 100 -j ACCEPT  
需要的人可以到下面的地址看 动画   
<http://www.fineacer.com/Soft_Show.asp?SoftID=231>  
<http://www.fineacer.com/Soft_Show.asp?SoftID=254>

13.at 计划任务的 检查 (包括at.deny at.allow 文件的检查) 这里强调一下 很多服务都有这样地后缀名为 deny allow  
文件 设置不当 就会给人以可乘之机 所以前面说的 对服务设置地了较 同样非常重要) 

  
14.cron 设置 检查 定期运行的 列表里 有什么不妥当的 shell

15.系统在分区过程中 最好能够 把一些目录分开 如果有多的硬盘 最好把/home 和 应用程序的目录分在各自单独的  
硬盘上 并且做好 用户的磁盘配额 来防止 入侵后对系统进行 恶意的写数据 破坏硬盘的数据 最大限度上保证  
数据的安全   
\----经常检查磁盘空间对维护Linux的文件系统非常必要。而Linux中对磁盘空间维护使用最多的命令就是df和du了。 

\----df命令主要检查文件系统的使用情况，通常的用法是: 

\----#df -k 

\----Filesystem 1k-blocks Used Available Use% Mounted on 

\----/dev/hda3 1967156 1797786 67688 96% / 

\----du命令检查文件、目录和子目录占用磁盘空间的情况，通常带-s选项使用，只显示需检查目录占用磁盘空间的总计，   
而不会显示下面的子目录占用磁盘的情况。 

\----% du -s /usr/X11R6/* 

\----34490 /usr/X11R6/bin 

\----1 /usr/X11R6/doc 

\----3354 /usr/X11R6/include 

  
16.做好 raid 磁盘列阵 来防止硬盘的损坏 (安全不仅仅 指的是 系统的安全还 包括数据的安全和通讯的安全)

目前 raid的方案分为7个级别  
其中 0, 1, 5 三个级别经常用到

17.文件的文件完整性检查 工具 tripwire 用来检查文件的 完整性 ( 所以强烈建议 linux 系统的管理员  
在工作过程中 做好工作笔记 记录在对系统设置修改中 更改的设置) 完整性检查的数据不要保存到这台  
主机的硬盘上 最好使用移动介质(cdrom 或者移动硬盘)

18.检查一些容易被黑客替换的命令文件 ls mount netstat lsof top ..... 并且要备份一套 完整的没有做过修改的  
系统检查文件的 备份 (防止 这些检查工具被 木马话或者被替换 )

19.最好 使用 chattr 命令 给写文件加上 一些属性 比如 +i 这样可以防止任意更改文件 给日志文件加上 +a的  
属性 这个属性是只许添加 不许更改的属性   
反正修改 grub 的内容  
chattr +i /etc/grub   
防止未经许可的删除或添加服务：   
[root@kapil /]# chattr +i /etc/services 

需要注意的目录 /bin /sbin /usr/bin 和/lib 这些目录都是不经常变动的   
(虽然不能阻止 获得root 用户的黑客修改参数 但是对 防范脚本攻击却非常有效 可以避免  
软件本身有漏洞 造成被人修改 至少可以延缓 别人的攻击速度 对方停留在系统的时间越长 留下的日志也就越多  
还有专门的工具 可以增强这个功能 设置后甚至于root 用户都无权修改)

20.备份文件 这样可以在出现问题的时候快速恢复数据

21.syslogd 日志 最好设置一个远程日志服务器来保存日志 (这样在黑客攻破主机后 为了擦除 日志记录 就必须攻击  
日志服务器 并且日志服务器上有可能只有开启日志的服务 从而为入侵增加了难度 争取了 大量的时间)  
在这里 还要说明一点 一旦root 用户被攻破 黑客很容易从syslog-ng的配置文件中 发现日志文件发送的目标  
(就是远程的日志服务器地址) 黑客可能无法攻破日志主机但是 很有可能发动 dos 攻击导致日志主机崩溃无法记录  
黑客在后面 所做的操作 这样会对通过日志文件找出他攻击的方法 造成很大的难度   
所以 为了能够欺骗 黑客 可以 设置日志发送到内部网络中的假的或者不存在的目标 同时在网络中 设置一个秘密  
的日志主机 通过一种软件 passlogd 把秘密的日志服务器的网卡设置成为混和模式 来记录网络中传送的所有日志  
(passlogd 是一种日志嗅探工具)  
如果是使用交换机 可以在交换机上设置对这个秘密日志服务器的某一个端口转发所有的数据包 

所以建议: 同时设置2个日志服务器 一个秘密 一个为公开 这样 可以对黑客的攻击日志服务器 起到很好的作用

由于日志文件是以明文传输的 容易被人截获 所以需要以加密的方式来传递日志信息 可以使用stunnel 来加密数据

(stunnel 在安全焦点有下载) 但是由于加密了 就会导致passlogd 嗅探工具失效 所以这需要自己平衡

22.logsentry 日志监视工具 这个是用来在发现 监视工具中设置的一些敏感的 日志可以   
尽快 发到 管理员手上

  
23.protsentry 端口监视工具 这个可以设置一些端口 来防止黑客对系统的踩点(扫描) 这工具还可以设置 一些  
被扫描后 运行什么脚本的功能 所以功能强大 如果可以设置的好 可以非常有效的防止 黑客对系统的扫描

24\. 删除所有的特殊账户   
你应该删除所有不用的缺省用户和组账户（比如lp, sync, shutdown, halt, news, uucp, operator, games, gopher等）。   
删除用户：   
[root@kapil /]# userdel LP   
删除组：   
[root@kapil /]# groupdel LP   
修改/etc/profile 文件  
上面强调的都是从 网络上攻击的防范方法:

其实物理的安全同样重要 要是人家 拿走了你的硬盘 恐怕你的设置再安全也是 于事无补

25.同时对 bios 设置和 给grub 加密 还有 对自己离开主机是 锁定 系统都是非常必要的 ( 可以防止 别人通过  
物理接触来攻破系统)

Bios Security   
一定要给Bios设置密码，以防通过在Bios中改变启动顺序，而可以从软盘启动。这样可以阻止别人试图  
用特殊的启动盘启动你的系统，还可以阻止别人进入Bios改动其中的设置（比如允许通过软盘启动等）。 

  
26.上面的做的再好 没有管理员的责任心 敬业精神 警惕心 和上进心 (每天需要对日志 和关键信息的 查阅 应该是管理  
员的必修课 同时需要不断的学习 增强自己的技术水平) 再强的硬件和环境 都是一堆摆设 只会 成为黑客谈论的  
笑柄 说白了 安全在于人为 不要怪罪于软件和硬件 本身 !! 

\-------------------------引用黑客常说的一句话; 没有入侵不了的系统  
我加上一句 :但是事在人为 肯定会有打败不了的管理员

最后忠告大家 当发现自己被某个 ip入侵 请不要采取极端的恶意攻击活动 最好 发信件告知 (因为攻击主机很可能  
是 黑客的跳板) 采取恶意攻击 搞不好会把自己 搞进监狱 

由于我并不是一个 非常了解入侵 的一个菜鸟 上面的有些知识点 有出入 希望大家给予添加和指导

