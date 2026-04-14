---
title: "[置顶]微信快速开发框架（六）-- 微信快速开发框架（WXPP QuickFramework）V2.0版本上线--源码已更新至github"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# [置顶]微信快速开发框架（六）-- 微信快速开发框架（WXPP QuickFramework）V2.0版本上线--源码已更新至github

> 原文链接: https://www.cnblogs.com/inday/p/wxpp-quick-framework-v-2.html | 迁移自博客园

---

4月28日，已增加多媒体上传及下载API，对应MediaUploadRequest和MediaGetRequest

\----------------------------------------------------------------------------

4月24日，感谢@八二制造的提醒，修复了自定义菜单查询返回的错误，现已修正。

\-----------------------------------------------------------------------------

4月21日，框架类库已更新至NuGet，在NuGet中搜索JCSoft或者Weixin就能查到，感谢大家的支持，后续会把Outh2验证加上

NuGet控制台使用方法：

PM> Install-Package JCSoft.WX.Framework

\----------------------------------------------------

用了一个多星期的时间，把微信快速开发框架进行了改进，之前1.0版本针对的是普通订阅号，V2.0版本将会对微信所有接口都进行支持。楼主开发的目的也是想让大家能够快速建立起微信公众平台（WXPP），据说现在开发个微信公众平台月薪可以达到10K，如果您觉得好，也可以[捐助](https://me.alipay.com/jamesying)楼主一下，哈哈。

好久没被首推了,现在怎么申请首推啊?

此次更新的内容：

1、去除了Model类库，合并到WX.Framework类库

2、增加了对高级接口的支持

3、增加了API调用方式

4、支持获取AccessToken

5、增加了测试代码

6、增加群发功能，包括群发后时间的响应。

这次更新的内容较多，我会一一来演示给大家看的，目前还未支持上传和下载媒体文件，对于微信文档中说的Post/Form方式不太了解，示例也用了CURL，这个更不了解了。

# 微信公众平台类型

如果您刚解除微信公众平台，可以参考【[建立微信公众平台测试账号](http://www.cnblogs.com/inday/p/weixin-public-platform-test-account.html)】，目前微信公众平台账号类型分为：订阅号，服务号，账号类型的不同，所支持的接口也不相同：

[![image](https://images0.cnblogs.com/blog/4871/201404/171653230721421.png)](https://images0.cnblogs.com/blog/4871/201404/171653227447221.png)

之前1.0版本仅仅支持订阅号未认证的情况。1.0版本的使用可以参考：【[体验微信公众平台快速开发框架](http://www.cnblogs.com/inday/p/wx-publicform-quick-framework-webdemo.html)】和【[利用快速开发框架，快速搭建微信浏览博客园首页文章](http://www.cnblogs.com/inday/p/weixin-publicf-platform-cnblogs.html)】

通过实现IMessageRole.MessageRole(MiddleMessage message)和IMessageHandler.HandlerRequestMessage(MiddleMessage message)，自定义规则和返回数据。在此不再重复表述。

# V2.0支持自定义菜单及高级接口

V2.0已经基本支持自定义菜单及高级接口，自定义菜单和高级接口采用API方式与微信服务器端交互。

IApiClient:Api接口类

DefaultApiClient:实现了IApiClient的Execute方法

ApiResponse:微信服务端返回的数据，这个是个抽象类，所有继承的Response在WX.Model.Responses命名空间内

ApiRequest<ApiResponse>：发送到微信服务器短的数据，也是个抽象类，所有与之相关的Request都在WX.Model.Requests命名空间内

ApiRequest<ApiResponse>与ApiResponse是一一对应的关系。

ApiAccessTokenManager：因为自定义菜单及高级接口都需要AccessToken，所以写了一个TokenManager，使用的是单例模式，如果您想使用此类，您必须在配置文件中提供：wxappid和wxappsecret的值，也可以通过ApiAccessTokenManager.Instance.SetAppIdentity(appid, appsecret)初始设置。

# 示例一：获取AccessToken

上述已经说明，在自定义菜单和高级接口中，都需要提供AccessToken，AccessToken的获取方式可以查看[微信平台文档](http://mp.weixin.qq.com/wiki/index.php?title=%E8%8E%B7%E5%8F%96access_token)。

自定义获取AccessToken方式：
    
    
             var appid = new AppIdentication("appid", "appsecret");
                var request = new AccessTokenRequest(appid);
                IApiClient client = new DefaultApiClient();
                var response = client.Execute(request);
                if (response.IsError)
                {
                    Console.WriteLine("get token is error");
                }
                else
                {
                    Console.WriteLine(response.Access_Token);
                }

使用ApiAccessTokenManager获取AccessToken：
    
    
    ApiAccessTokenManager.Instance.GetCurrentToken();

使用ApiAccessTokenManager的话，必须先设置AppId和AppSecret，有2种方式：

1、配置文件方式：

<configuration>   
<appSettings>   
<add key="wxappid" value="123"/>   
<add key="wxappsecret" value="123"/>   
</appSettings>   
</configuration>

2、代码方式：
    
    
    ApiAccessTokenManager.Instance.SetAppIdentity("123", "123");

要注意下，GetCurrentToken()使用前，您必须配置好您的Appid和AppSecret。

ApiAccessTokenManager还提供了过期管理，一般Token的有效时间为7200秒，ApiAccessTokenManager可以自动刷新Token。

# 创建自定义菜单

普通的订阅号只要认证以后，就支持了自定义菜单，目前认证费为300元，接口详细文档请[点击查看](http://mp.weixin.qq.com/wiki/index.php?title=%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95%E5%88%9B%E5%BB%BA%E6%8E%A5%E5%8F%A3)

我们先看下实现后的效果：

[![image](https://images0.cnblogs.com/blog/4871/201404/171653238858006.png)](https://images0.cnblogs.com/blog/4871/201404/171653233381107.png)

接下来，我们看下实现代码：
    
    
    var request = new MenuCreateRequest
                {
                    AccessToken = ApiAccessTokenManager.Instance.GetCurrentToken(),
                    Buttons = new List<ClickButton>
                    {
                        new ClickButton{
                            Name = "博客",
                            Url = "http://inday.cnblogs.com",
                            Type = ClickButtonType.view
                        },
    
                        new ClickButton{
                            Name = "文章",
                            SubButton = new List<ClickButton>{
                                new ClickButton{
                                    Name = "推荐",
                                    Url = "http://www.cnblogs.com",
                                    Type = ClickButtonType.view
                                },
                                new ClickButton {
                                    Name = "精华",
                                    Url = "http://www.cnblogs.com/pick/",
                                    Type = ClickButtonType.view
                                }
                            }
                        },
    
                        new ClickButton{
                            Name = "新闻",
                            Url="http://www.cnblogs.com/news/",
                            Type = ClickButtonType.view
                        },
                    }
                };
                var response = m_client.Execute(request);
                if (response.IsError)
                {
                    Console.WriteLine(response);
                }
                else
                {
                    Assert.Equal(false, response.IsError);
                    Assert.Equal("ok", response.ErrorMessage);
                }

简单吧，你只要提供一个MenuCreateRequest的实例，通过IApiClient.Execute执行就可以了。

我在Api.Requests和Api.Responses中的命名规则是根据微信服务器路径的规则。比如创建自定义菜单的url为：[![image](https://images0.cnblogs.com/blog/4871/201404/171653242755719.png)](https://images0.cnblogs.com/blog/4871/201404/171653240888477.png)

所以我的Request就是MenuCreateRequest，对应的Response就是MenuCreateResponse。

如果想看测试想过，请微信扫描一下我的测试公众账号：![QQ截图20131211120953](https://images0.cnblogs.com/blog/4871/201312/11143034-d075dd2c36ef427b97e83a18d19d84fd.jpg)

# 获取所有关注用户

接下来我们看下如何获取所有关注用户，此为高级接口，需要服务号+认证，详情点击[查看文档](http://mp.weixin.qq.com/wiki/index.php?title=%E8%8E%B7%E5%8F%96%E5%85%B3%E6%B3%A8%E8%80%85%E5%88%97%E8%A1%A8)
    
    
    var request = new UserGetRequest
                {
                    AccessToken = ApiAccessTokenManager.Instance.GetCurrentToken(),
                    NextOpenId = ""
                };
                var response = m_client.Execute(request);
                if (!response.IsError)
                {
                    foreach (var user in response.Data.OpenIds)
                    {
                        Console.WriteLine(user);
                    }
                }

默认每次提取10000个关注用户，我在Xunit测试下，测试结果如下：

[![image](https://images0.cnblogs.com/blog/4871/201404/171653246822363.png)](https://images0.cnblogs.com/blog/4871/201404/171653244474434.png)

OpenId为对于某一公众账号的唯一标示，我们可以指定NextOpenId指定提取此ID后10000个关注用户，比如：
    
    
    var request = new UserGetRequest
                {
                    AccessToken = ApiAccessTokenManager.Instance.GetCurrentToken(),
                    NextOpenId = "oI1_vjreLbQfGy79Thnsh4ziJZNo"
                };

结果：

[![image](https://images0.cnblogs.com/blog/4871/201404/171653251195062.png)](https://images0.cnblogs.com/blog/4871/201404/171653249164591.png)

# Api接口对应文档

篇幅有限，不可能一一介绍，大家可以参考[微信开发文档](http://mp.weixin.qq.com/wiki/index.php?title=%E9%A6%96%E9%A1%B5)，使用[申请测试账号](http://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)进行测试，快速开发框架对应的Api如下表所示。

功能 |  ApiRequest |  ApiResponse  
---|---|---  
[自定义菜单创建接口](http://mp.weixin.qq.com/wiki/index.php?title=%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95%E5%88%9B%E5%BB%BA%E6%8E%A5%E5%8F%A3) |  MenuCreateRequest |  MenuCreateResponse  
[自定义菜单查询接口](http://mp.weixin.qq.com/wiki/index.php?title=%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95%E6%9F%A5%E8%AF%A2%E6%8E%A5%E5%8F%A3) |  MenuGetRequest |  MenuGetResponse  
[自定义菜单删除接口](http://mp.weixin.qq.com/wiki/index.php?title=%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3) |  MenuDeleteRequest |  MenuDeleteResponse  
[创建分组](http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3#.E5.88.9B.E5.BB.BA.E5.88.86.E7.BB.84) |  GroupsCreateRequest |  GroupsCreateResponse  
[查询所有分组](http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3#.E6.9F.A5.E8.AF.A2.E6.89.80.E6.9C.89.E5.88.86.E7.BB.84) |  GroupsGetRequest |  GroupsGetResponse  
[查询用户所在分组](http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3#.E6.9F.A5.E8.AF.A2.E7.94.A8.E6.88.B7.E6.89.80.E5.9C.A8.E5.88.86.E7.BB.84) |  GroupsGetIdRequest |  GroupsGetIdResponse  
[修改分组名](http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3#.E4.BF.AE.E6.94.B9.E5.88.86.E7.BB.84.E5.90.8D) |  GroupsUpdateRequest |  GroupsUpdateResponse  
[移动用户分组](http://mp.weixin.qq.com/wiki/index.php?title=%E5%88%86%E7%BB%84%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3#.E4.BF.AE.E6.94.B9.E5.88.86.E7.BB.84.E5.90.8D) |  GroupsMembersUpdateRequest |  GroupsMembersUpdateResponse  
[获取用户基本信息](http://mp.weixin.qq.com/wiki/index.php?title=%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF) |  UserInfoRequest |  UserInfoResponse  
[获取关注者列表](http://mp.weixin.qq.com/wiki/index.php?title=%E8%8E%B7%E5%8F%96%E5%85%B3%E6%B3%A8%E8%80%85%E5%88%97%E8%A1%A8) |  UserGetRequest |  UserGetResponse  
[创建二维码Ticket](http://mp.weixin.qq.com/wiki/index.php?title=%E7%94%9F%E6%88%90%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E4%BA%8C%E7%BB%B4%E7%A0%81) |  QrcodeCreateRequest |  QrcodeCreateResponse  
[上传图文消息素材](http://mp.weixin.qq.com/wiki/index.php?title=%E9%AB%98%E7%BA%A7%E7%BE%A4%E5%8F%91%E6%8E%A5%E5%8F%A3#.E4.B8.8A.E4.BC.A0.E5.9B.BE.E6.96.87.E6.B6.88.E6.81.AF.E7.B4.A0.E6.9D.90) |  MediaUploadNewsRequest |  MediaUploadNewsResponse  
[根据分组进行群发](http://mp.weixin.qq.com/wiki/index.php?title=%E9%AB%98%E7%BA%A7%E7%BE%A4%E5%8F%91%E6%8E%A5%E5%8F%A3#.E6.A0.B9.E6.8D.AE.E5.88.86.E7.BB.84.E8.BF.9B.E8.A1.8C.E7.BE.A4.E5.8F.91) |  MessageMassSendAllRequest |  MessageMassSendAllResponse  
[根据OpenId列表进行发送](http://mp.weixin.qq.com/wiki/index.php?title=%E9%AB%98%E7%BA%A7%E7%BE%A4%E5%8F%91%E6%8E%A5%E5%8F%A3#.E6.A0.B9.E6.8D.AEOpenID.E5.88.97.E8.A1.A8.E7.BE.A4.E5.8F.91) |  MessageMassSendRequest |  MessageMassSendResponse  
[删除群发](http://mp.weixin.qq.com/wiki/index.php?title=%E9%AB%98%E7%BA%A7%E7%BE%A4%E5%8F%91%E6%8E%A5%E5%8F%A3#.E5.88.A0.E9.99.A4.E7.BE.A4.E5.8F.91) |  MessageMassDeleteRequest |  MessageMassDeleteResponse  
  
# 写在最后

经过一段时间的更新代码，对于微信快速开发框架也算告一段落，后续可能会比较忙碌点，如果出现bug，请大家与我取得联系，我会第一时间去更新代码，过段时间也会提供到腾讯公众论坛去，看看能否被推荐。

在项目中，我加入了测试项目，其中Really开头的为真实测试，需要Appid和AppSecret，Mock开头的为虚拟的，只测试了输出和返回的验证，可能不太严谨，但因为时间有限所以未做详细的测试。

在ApiRequest类中，都有Validate()的方法，目前还未完善，只有简单的对于AccessToken的验证，后续会与微信公众开发平台标准进行更新。

目前源代码完全公开在[Github](https://github.com/JamesYing/JCWX)中，开源协议还未想好，等有空再说吧。

最近参加了某个公司的应聘，未成功，人家就看了简历就否了，没办法，人老珠黄，文凭才中专，经验多有何用呢，呵呵！有好公司觉得在下还可以，可以与我私聊，不过本人有言在先，本人简历写得很烂（懒得更新，那么多项目谁记得清楚呢），无文凭（如果中专也算的话。。。），英文不会说只会看（目前关键就是在学英文），不过本人除了会开发外，还会根据工作的性质，技术结合工作来，相信物有所值滴。还有要笔试基础的就免了，实在没脑子去背这么多，不是专业的面试狂，只是想改善家庭生活而已。

