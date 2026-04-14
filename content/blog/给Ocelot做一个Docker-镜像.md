---
title: "给Ocelot做一个Docker 镜像"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 给Ocelot做一个Docker 镜像

> 原文链接: https://www.cnblogs.com/inday/p/create-a-ocelot-docker-image.html | 迁移自博客园

---

# 写在前面

在微服务架构中，ApiGateway起到了承前启后，不仅可以根据客户端进行分类，也可以根据功能业务进行分类，而且对于服务调用服务也起到了很好的接口作用。目前在各个云端中，基本上都提供了ApiGateway的功能（付费功能），通过SDK或者在线进行配置。  
在Java体系中有[Zuul](https://github.com/Netflix/zuul)和[Kong](https://github.com/Kong/kong)都是比较著名的。  
在.Net体系中，目前比较热门的（短短1年时间已经1000+stars了）  
[Ocelot](https://github.com/TomPallister/Ocelot)，这是一个非常优秀的基于 .Net Core的Api网关开源项目，我们的在[队长](https://www.cnblogs.com/shanyou)也参与了开发，过年前又被纳入了微软[eShop](https://github.com/dotnet-architecture/eShopOnContainers)微服务架构Demo项目中，作为其Api网关，目前正在整合中，有兴趣可以关注项目中新的的[Ocelot Branch](https://github.com/dotnet-architecture/eShopOnContainers/tree/ocelot)。

基本的使用方式在园中已有[博主](http://www.cnblogs.com/ibeisha/p/ocelot.html)写过了，不过内容是之前版本的，新版本稍微有点不同，还是建议大家看[文档](http://ocelot.readthedocs.io/en/latest/)。通过文档我们了解，Ocelot是通过一个json文件进行配置的，所以在使用的时候我们只需要修改这个json文件就可以了，每次为不同的ApiGateway创建不同的项目比较麻烦，So，今天来讲下如何把Ocelot做成一个Docker镜像，这样使用的时候只需要输入一条docker指令即可。

> 今天的Dockerfile我是Fork了Ocelot项目后在自己的[Branch](https://github.com/JamesYing/Ocelot/tree/latest-old/)中弄的，直接是项目引用，这只是范例而已，你可以重新创建一个专门的项目，通过Nuget管理添加对Ocelot的引用。

# 创建Dockerfile代码

Dockerfile只是一个文本文件，它每一行代表Docker镜像的一个layer，每一行由命令加参数组成，我们通过编写简单的命令，就能使用docker工具生成docker镜像。  
首先你要在项目中创建Dockerfile，请记住，把你的Dockerfile放在sln目录下，因为Dockerfile文件的build环境是按照你这个文件的目录来的，切记，博主之前花了N天才发现这个弱智的问题。docker command对文件名对大小写敏感。

直接上代码：
    
    
    FROM microsoft/aspnetcore:2.0 AS base #基于asp.net core 2.0镜像
    WORKDIR /app
    EXPOSE 80
    
    # 先使用asp.net core build镜像，然后复制项目到/src目录
    FROM microsoft/aspnetcore-build:2.0 AS build
    WORKDIR /src
    COPY *.sln ./
    COPY demos/ApiGateway.Web/ApiGateway.Web.csproj demos/ApiGateway.Web/
    COPY src/Ocelot/Ocelot.csproj src/Ocelot/
    
    RUN dotnet restore
    
    COPY . .
    WORKDIR /src/demos/ApiGateway.Web
    RUN dotnet add package BuildBundlerMinifier
    #这里添加了对bundle的支持，你可以不使用，因为我更改了样式，所以这里加上了这个。
    RUN dotnet restore
    RUN dotnet build -c Release -o /app
    
    # 编译以后，我们进行发布，并直接复制到app目录
    FROM build AS publish
    RUN dotnet publish -c Release -o /app
    
    # 设定app目录为工作目录
    FROM base AS final
    WORKDIR /app
    COPY --from=publish /app .
    # 挂载/app/configurations目录
    VOLUME /app/Configurations
    
    ENTRYPOINT ["dotnet", "ApiGateway.Web.dll"]
    

上面就是我的Dockerfile文件了，我在项目中并没有把configuration.json文件放到项目根目录，而是另外创建了一个Configurations目录，这样我挂载目录，可以在多个容器中共享数据。

# 生成Docker镜像

如果你的机器上装了Docker，那可以通过命令工具，在项目的根目录运行：
    
    
    docker build -t myocelot:v1 .
    

注意这个命令后的.一定不要忘记哦

如果你机器上没有安装Docker，也没有关系，可以通过Docker仓库或者阿里云的容器管理进行生成，他们都是免费的，博主使用的是阿里云容器管理创建的，这样每次代码改动，它会自动生成新的镜像。

# 运行容器

当我们有了镜像后，就可以运行容器了，因为博主用的是阿里云容器管理，所以我需要先把镜像pull到运行环境（我用的是阿里云ECS）
    
    
    docker pull registry.cn-hangzhou.aliyuncs.com/jamesying/ocelot-demo
    docker tag registry.cn-hangzhou.aliyuncs.com/jamesying/ocelot-demo myocelot:v1
    

博主通过pull命令拉了镜像后又通过tag命令重新命名了tagname。

随后我们创建一个ocelot的配置文件目录,并创建configurations.json文件：
    
    
    mkdir /home/ocelot
    touch /home/ocelot/configurations.json
    

下面通过vi工具配置你自己的config，下面是博主的：
    
    
    {
      "ReRoutes": [
        {
          "DownstreamPathTemplate": "/api/values/{id}",
          "DownstreamScheme": "http",
          "DownstreamHostAndPorts": [
    
            {
              "Host": "localhost",
              "Port": 6002
            },
            {
              "Host": "localhost",
              "Port": 6001
            }
          ],
          "LoadBalancer": "RoundRobin",
          "UpstreamPathTemplate": "/api/v1/values/{id}",
          "DownstreamHealthcheckPath": "/hc?apikey=testapi",
          "UpstreamHttpMethod": [ "GET", "Put", "Delete" ]
        }
      ],
      "GlobalConfiguration": {}
    }
    

后面我们来运行容器：
    
    
    docker run --name myocelot -p 6008:80 -v /home/ocelot:/app/configurations -d ocelot:v1
    

成功运行以后，我们就可以通过6008端口访问了，你可以通过 <http://ocelot.jcsoft.xyz:6008> 看下Demo。下图为演示截图：  
![image](https://images.cnblogs.com/cnblogs_com/inday/14896/o_TIM%e6%88%aa%e5%9b%be20180224162737.png)

# 写在最后

为什么会有这个镜像呢，因为通过镜像生成很简单，而且配置文件更改后，只需要docker restart myocelot就能重新加载，非常简便。今天的内容很简单，但很实用，当然这个镜像还是有点欠缺的，因为Ocelot有很多功能，还需要在Startup.cs中注册一些service才可以使用，博主有个想法，弄个专门的Ocelot Demo，只需要通过config文件就能自动注册相应服务。

或许你从Demo中看到了楼主对Ocelot的改动，楼主增加了 `DownstreamHealthcheckPath`属性，这个是为了对下游服务器进行Healthcheck的，而且楼主也PR给了Ocelot的项目负责人，不过Tom不太清楚这个属性有何用，所以我准备做个Demo给他看下，这个属性很有用，除了可以通过试图查看下游服务器状态，同时也可以在LoadBalance的时候把无效的服务器给忽略掉。

大家觉得Healthcheck是否有必要呢？

