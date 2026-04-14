---
title: "JQuery 对控件的事件操作"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# JQuery 对控件的事件操作

> 原文链接: https://www.cnblogs.com/inday/archive/2009/07/17/JQuery-Bind-Event.html | 迁移自博客园

---

JQuery是非常棒的js类库，有丰富的UI库和插件，不过我钟爱他的是他的选择器，感觉其他功能有时跟后台人员距离很远，所以一般我也只使用一下他的选择器。

今天突然对他的事件产生了兴趣，先前也碰到过，也没整理，今天有空就弄一下咯。

对于控件的事件，jQuery已经提供了丰富的方法，包括绑定、一次绑定、触发等，阿拉今早看看叫一哪能用额伐，大虾路古就可以了。

jQuery的绑定事件非常方便，有bind、live、one还有它帮你把一些常用的事件给单独了出来，比如控件的onclick事件，我们绑定onclick事件的时候只需要
    
    
    $("#testButton").click(function() {
        alert("I'm Test Button");
    });

就这样我们在testButton这个按钮上绑定了onclick事件，执行alert语句。我们也可以使用 
    
    
    $("#testButton").click();

来触发这个onclick事件，一切都非常ok啦。以上有点sb了，接下来看看取消事件。jQuery有unbind的方法，专门来取消绑定的，也就是取消事件，按照上面的例子的话，应该使用： 
    
    
    $("#testButton").unbind("click");

恩，看上去非常好，如果你的click有2个事件的话，你还可以使用unbind("click", fnName)来删除特定函数的绑定。 为什么有这个取消特定函数的方法呢，我们来看下例子，我们会发现，javascript的事件，跟C#的事件如出一辙,事件的绑定是叠加（+=） 而不是覆盖。 
    
    
        var Eat = function() {
            alert("我要吃饭");
        }
    
        var PayMoney = function() {
            alert("先付钱");
        }
    
        jQuery(document).ready(function() {
            $("#testButton").click(Eat);
            $("#testButton").bind("click", PayMoney);
        });

通过上面的例子，我们发现会先弹出：“我要吃饭”紧接着会弹出“先付钱”,说明它的绑定是通过onclick+=fn进行的。我们修改下ready的方法： 
    
    
            jQuery(document).ready(function() {
                $("#testButton").click(Eat);
                $("#testButton").unbind();
                $("#testButton").bind("click", PayMoney);
            });

又SB了，呵呵，这次点击按钮的话，只会执行PayMoney，不会执行Eat，那如果把unbind()放在bind后面的话，这样这个按钮就不会起作用了。但如果我要去掉绑定的PayMoney方法呢？这时候我们应该这样写： 
    
    
            jQuery(document).ready(function() {
                $("#testButton").click(Eat);
                $("#testButton").bind("click", PayMoney);
                $("#testButton").unbind("click", PayMoney);
            });

嘿嘿，跟bind其实一个样，不过接下来你将看到一个bug（我不知道算不算），让我们近距离体验一下： 
    
    
    <input id="testButton" type="button" value="Test Button" onclick="Eat();" />
    <script type="text/javascript">
            jQuery(document).ready(function() {
                $("#testButton").unbind("click", Eat);
                $("#testButton").unbind();
                $("#testButton").bind("click", PayMoney);
            });
    </script>

大家猜猜，会显示什么？吃饭？付钱？答案是Eat -> PayMoney，啊！！！我这里取消了绑定，又删除了特定的绑定，为什么还会执行Eat呢？ 其中的原由要看jQuery的类库了，我估计它只删除了通过JQuery绑定的那些事件了，呵呵。 那这时候我们该如何呢？好在jQuery有很多方法，其中一个就是attr，他是对Dom元素的属性进行操作，我们利用attr来消除input上的click事件。 
    
    
        $("#testButton").attr("onclick", "");

这样就可以把onclick事件清除了，记住，attr上因为是元素的属性，所以这里要写 “onclick” 而不是click，因为click是jQuery封装好的简写方式。 好了，绑定就到这里了，弄个场景，大家也好记得住点： 一日，老应、老赵、老陈出去吃饭，吃饱了，喝足了，准备付钱了，这时候： 
    
    
    <head>
    
        <script type="text/javascript" src="jquery-1.2.6.min.js"></script>
    
        <script type="text/javascript">
    
            var PayMoney = function(name) {
                alert(name + "：今天我请客，我来付钱");
            }
    
            jQuery(document).ready(function() {
                $("#JeffreyPay").attr("onclick", "");
                $("#JamesPay").attr("onclick", "");
    
                $("#JeffreyPay").click(function() {
                    alert("。。。。这里不能刷卡");
                });
    
                $("#JeffreyPay").click(function() {
                    PayMoney("陈大");
                });
                $("#JamesPay").bind("click", function() {
                    alert("。。。。忘记带钱包了");
                });
                $("#JamesPay").bind("click", $("#DlyingPay").attr("onclick"));
            });
        </script>
    
    </head>
    <body>
        <input id="JeffreyPay" onclick="PayMoney('赵帅');" type="button" value="老赵付钱" />
        <input id="JamesPay" type="button" onclick="PayMoney('老应');" value="老应付钱" />
        <input id="DlyingPay" type="button" onclick="PayMoney('陈大');" value="老陈付钱" />
    </body>

以上内容均为原创，不要用在邪恶的地方哦。其实jQuery在绑定事件上还存在很多bug，大家可以稍微修改下上面的效果就会知道了，比如自动执行，绑定失败等，呵呵。

[http:/inday.cnblogs.com](http://inday.cnblogs.com/)

