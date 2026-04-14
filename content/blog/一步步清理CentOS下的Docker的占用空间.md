---
title: "一步步清理CentOS下的Docker的占用空间"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 一步步清理CentOS下的Docker的占用空间

> 原文链接: https://www.cnblogs.com/inday/p/19331669 | 迁移自博客园

---

清理CentOS下Docker占用空间可按**先排查→再清理→最后验证** 的步骤操作，以下是详细且安全的操作指南（全程建议使用`sudo`确保权限）：

### 一、第一步：查看Docker空间占用（定位问题）

先明确Docker的空间消耗分布，避免盲目清理。

#### 1\. 查看Docker整体磁盘使用情况
    
    
    docker system df
    

输出示例（关键字段说明）：
    
    
    TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
    Images          15        8         10.2GB    5.8GB (56%)  # 镜像占用
    Containers      20        5         2.3GB     1.9GB (82%)  # 容器（停止的）占用
    Local Volumes   8         3         4.5GB     2.1GB (46%)  # 数据卷占用
    Build Cache     30        0         1.8GB     1.8GB (100%) # 构建缓存占用
    

  * `RECLAIMABLE`：可回收的空间（核心关注）。



#### 2\. 细化排查（定位具体大文件/无用资源）

##### （1）查看所有镜像（含未标记的虚悬镜像）
    
    
    docker images -a  # 列出所有镜像（包括中间层）
    docker images -f "dangling=true"  # 仅查看虚悬镜像（<none>:<none>）
    

##### （2）查看所有容器（含停止的）
    
    
    docker ps -a  # 列出所有容器（STATUS列显示Up/Exited）
    # 查看容器磁盘占用（按大小排序）
    docker ps -a --format "{{.Names}}\t{{.Size}}" | sort -h -k2 -r
    

##### （3）查看数据卷（含未使用的）
    
    
    docker volume ls  # 列出所有数据卷
    # 查看数据卷实际磁盘占用（需安装du工具，CentOS默认有）
    docker volume inspect <VOLUME_NAME> | grep Mountpoint  # 找到挂载路径
    du -sh <挂载路径>  # 查看具体大小（例：du -sh /var/lib/docker/volumes/xxx/_data）
    

##### （4）查看构建缓存/日志等
    
    
    # 查看Docker根目录总占用
    du -sh /var/lib/docker  # Docker默认数据目录
    # 查看日志文件（容器日志可能占大量空间）
    ls -lh /var/lib/docker/containers/*/*.log | sort -h -r
    

### 二、第二步：安全清理Docker资源（按优先级）

清理原则：**先清理无风险的→再清理可确认无用的→最后手动清理大文件** ，避免误删运行中容器/镜像。

#### 1\. 自动清理（推荐优先用，安全且高效）

Docker内置清理命令，可一键清理无用资源（不会删除运行中的容器/正在使用的镜像/数据卷）：
    
    
    # 清理所有未被使用的资源（虚悬镜像、停止的容器、未使用的数据卷、构建缓存）
    docker system prune -a
    
    # 如需清理未使用的数据卷（谨慎！确认无重要数据），加--volumes参数
    docker system prune -a --volumes
    

执行时会提示确认，输入`y`即可。

#### 2\. 手动精细化清理（补充自动清理）

如果自动清理后仍有大量空间占用，按类别手动清理：

##### （1）清理虚悬镜像（无标签、无容器引用）
    
    
    docker rmi $(docker images -f "dangling=true" -q)
    

##### （2）清理停止的容器
    
    
    # 先停止所有运行中的容器（可选，仅清理停止的则跳过）
    # docker stop $(docker ps -q)
    # 删除所有停止的容器
    docker rm $(docker ps -a -q)
    

##### （3）清理未使用的数据卷（核心！数据卷不会被prune默认清理）
    
    
    # 第一步：查看未被使用的数据卷
    docker volume ls -qf dangling=true
    # 第二步：删除这些数据卷（确认无重要数据！）
    docker volume rm $(docker volume ls -qf dangling=true)
    

##### （4）清理容器日志（占空间大户）

容器日志默认无大小限制，可手动清理或配置日志轮转：
    
    
    # 方式1：直接清空所有容器日志（不删除文件，避免容器报错）
    sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*.log"
    
    # 方式2：配置日志轮转（永久解决，推荐）
    # 编辑/etc/docker/daemon.json（无则创建）
    sudo vi /etc/docker/daemon.json
    # 添加以下内容（限制单日志文件100MB，最多保留3个）
    {
      "log-driver": "json-file",
      "log-opts": {
        "max-size": "100m",
        "max-file": "3"
      }
    }
    # 重启Docker生效
    sudo systemctl restart docker
    

##### （5）清理构建缓存（buildx/build缓存）
    
    
    # 清理传统build缓存
    docker builder prune -a
    
    # 如使用buildx，额外清理
    docker buildx prune -a
    

### 三、第三步：验证清理结果
    
    
    # 再次查看Docker空间占用
    docker system df
    # 查看Docker根目录总占用
    du -sh /var/lib/docker
    

对比清理前的数值，确认空间已释放。

### 四、注意事项（避坑！）

  1. **禁止直接删除/var/lib/docker目录** ：会导致所有镜像/容器/数据卷丢失，除非确认完全废弃。
  2. **清理数据卷前务必备份** ：数据卷存储容器持久化数据（如数据库、配置），误删会导致数据丢失。
  3. **运行中的容器/镜像不要删** ：`docker system prune`默认会保留运行中资源，手动删除前用`docker ps`确认容器状态。
  4. **定期清理** ：可将`docker system prune -a`加入crontab（定时任务），避免空间持续占用。



### 示例：定时任务配置（每周日凌晨2点清理）
    
    
    # 编辑定时任务
    sudo crontab -e
    # 添加以下内容
    0 2 * * 0 /usr/bin/docker system prune -a -f  # -f跳过确认提示
    

按以上步骤操作，可安全、彻底地清理Docker占用的CentOS磁盘空间。如果某一步报错（如权限不足），加`sudo`重新执行即可。

