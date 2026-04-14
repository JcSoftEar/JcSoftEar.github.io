---
title: "JQuery JCshare 0.1 分享插件"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# JQuery JCshare 0.1 分享插件

> 原文链接: https://www.cnblogs.com/inday/archive/2010/12/01/jquery-jcshare-0-1.html | 迁移自博客园

---

一、介绍：   
现在各类SNS网站、微博等都开设了分享接口，可以让你的咨询更快、更有效的通过用户分享给其好友，外面也有很多一键式的分享控件。我们公司网站（[巴士国旅](http://www.sh-bus.com)）为了让用户及其好友更快分享到我们巴士的特价线路，自己研究了下，写了个简单的JQery插件，现在完全开源，方便大家扩展。原理很简单，拼接了分享接口的url，很多一键式控件是弹窗类型的，我这里做成链接形式，或许后面一个版本，会加入弹窗类型，暂时先这样吧，用下来还不错，欢迎大家拍砖。 

二、目录介绍：   
|-----scripts 脚本   
|------jquery-1.3.2.min.js jquery 1.3.2   
|------jquery.jcshare.js 分享插件   
|-----styles 样式   
|------jcshare.css 分享样式   
|------share.gif 背景图片   
三、安装：   
1、链接样式   
2、链接jquery和分享插件的js文件   
3、在$(document).ready(function(){})中 调用分享插件：   
$(document).share({   
title: document.title + "-James.Ying-巴士国旅",   
content: "更多旅游线路尽在巴士国旅",   
url: document.URL   
});   
第一版中，只支持title，content，url，稍后会加入图片，现在也仅支持链接方式，弹窗以后再加了。   
4、分享链接：   
<a href="javascript:void(0);" title="把此线路分享到开心网" class="share share_kaixin">&nbsp;</a>   
<a href="javascript:void(0);" title="把此线路分享到新浪微博" class="share share_sina">&nbsp;</a>   
<a href="javascript:void(0);" title="把此线路分享到豆瓣网" class="share share_douban">&nbsp;</a>   
<a href="javascript:void(0);" title="把此线路分享到人人网" class="share share_renren">&nbsp;</a>   
<a href="javascript:void(0);" title="把此线路分享到腾讯微博" class="share share_qq">&nbsp;</a>

使用了Jquery的选择器，如果对应的class改变的话，请在初始分享插件时，也把对应的class赋值，具体看代码。

[点击查看示例代码](http://www.sh-bus.com/Line/Detail/2149)

[分享插件下载](https://files.cnblogs.com/inday/jquery.jcshare.0.1.rar)

