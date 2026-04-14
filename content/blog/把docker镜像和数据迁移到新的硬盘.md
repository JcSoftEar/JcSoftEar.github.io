---
title: "把docker镜像和数据迁移到新的硬盘"
date: 2026-04-14
description: ""
categories: ["博客园迁移"]
tags: []
draft: false
---

# 把docker镜像和数据迁移到新的硬盘

> 原文链接: https://www.cnblogs.com/inday/p/19232349 | 迁移自博客园

---

要让 Docker 镜像、容器数据等所有相关文件都存储在新硬盘（如之前挂载的 /data 目录），核心是 修改 Docker 的数据存储目录（默认在 /var/lib/docker），步骤如下（兼容 CentOS 7/8/9，安全无数据丢失）：  
前置条件  
新硬盘已完成：分区（主分区）→ 格式化（ext4/xfs）→ 挂载（如 /data）→ 永久挂载（/etc/fstab 配置生效）；  
已验证新硬盘挂载正常（df -h 能看到 /dev/vdb1 → /data）；  
操作前确保 Docker 无运行中的容器（避免数据不一致）。  
完整步骤：迁移 Docker 数据到新盘  
步骤 1：停止 Docker 服务（关键！避免数据损坏）
    
    
    bash
    # 停止 Docker 服务（CentOS 7/8/9 通用）
    sudo systemctl stop docker
    # 确保 Docker 相关进程已完全停止（可选，验证）
    sudo systemctl status docker
    # 输出 "inactive (dead)" 表示已停止
    

步骤 2：在新盘创建 Docker 数据目录  
利用之前挂载的 /data 目录，创建 Docker 专属存储目录（便于管理）：
    
    
    bash
    sudo mkdir -p /data/docker
    # 赋予 Docker 服务对该目录的权限（避免权限不足）
    sudo chown -R root:root /data/docker
    sudo chmod -R 700 /data/docker  # Docker 要求数据目录权限为 700
    

步骤 3：迁移原有 Docker 数据到新盘（可选，保留历史镜像）  
如果之前已有 Docker 镜像 / 容器，需要将原有数据复制到新目录（避免重新拉取镜像）：
    
    
    bash
    # 用 rsync 复制数据（保留权限和软链接，比 cp 更安全）
    sudo rsync -a /var/lib/docker/ /data/docker/
    等待复制完成（时间取决于原有 Docker 数据大小，镜像多则耗时久）；
    复制后可验证：ls /data/docker 能看到 images、containers 等目录，说明复制成功。
    

步骤 4：修改 Docker 配置文件，指定新数据目录  
Docker 的配置文件默认是 /etc/docker/daemon.json（无则创建），通过 data-root 参数指定新存储目录：
    
    
    bash
    # 编辑或创建 daemon.json 文件
    sudo vim /etc/docker/daemon.json
    

添加以下内容（如果文件已有其他配置，如 insecure-registries，直接追加 data-root 字段）：
    
    
    json
    {
      "data-root": "/data/docker"  // 新硬盘上的 Docker 数据目录
    }
    

保存退出（vim 中按 ESC → :wq）。  
步骤 5：备份原有 Docker 目录（留坑，避免冲突）  
将默认的 /var/lib/docker 重命名备份，防止 Docker 启动时优先使用旧目录：
    
    
    bash
    sudo mv /var/lib/docker /var/lib/docker.old
    

步骤 6：启动 Docker 服务，验证配置生效
    
    
    bash
    # 启动 Docker 服务
    sudo systemctl start docker
    # 查看 Docker 状态（确认启动成功）
    sudo systemctl status docker
    

若启动失败，查看日志排查问题：sudo journalctl -u docker（常见原因：目录权限不足、daemon.json 格式错误）。  
步骤 7：验证 Docker 数据已存储在新盘  
验证 1：查看 Docker 信息（确认数据目录已修改）
    
    
    bash
    docker info | grep "Docker Root Dir"
    

输出示例：Docker Root Dir: /data/docker → 表示配置生效，Docker 已使用新目录。  
验证 2：拉取镜像测试（确认新镜像存储在新盘）  
bash

# 拉取一个测试镜像（如 alpine）

docker pull alpine:latest

# 查看新盘目录占用（确认镜像存储在 /data/docker）

du -sh /data/docker/images/  
输出示例：2.8M /data/docker/images/ → 说明镜像已存储在新盘，而非原 /var/lib/docker。  
验证 3：查看原有镜像（可选，迁移后验证）  
如果之前迁移了旧数据，执行 docker images 应能看到历史镜像，说明迁移成功。  
步骤 8：（可选）清理旧数据（确认新盘正常后）  
如果 Docker 启动正常、镜像拉取 / 运行无问题，可删除旧目录释放系统盘空间：  
bash  
sudo rm -rf /var/lib/docker.old  
关键注意事项  
权限问题：/data/docker 目录必须是 root:root 权限且 700 权限，否则 Docker 启动失败；  
配置格式：daemon.json 是 JSON 格式，字段间用逗号分隔（如同时配置 insecure-registries 和 data-root）：
    
    
    json
    {
      "insecure-registries": ["192.168.1.100:5000"],
      "data-root": "/data/docker"
    }
    

永久挂载：确保新硬盘已通过 fstab 配置永久挂载，否则重启服务器后新盘未挂载，Docker 会报错（无法访问 /data/docker）；  
云服务器特殊说明：如果是云服务器（阿里云 / 腾讯云），新硬盘是云硬盘，需确保已挂载且 fstab 配置正确（用 UUID 挂载，避免设备名变动）。  
总结  
通过修改 Docker 的 data-root 配置，所有 Docker 相关数据（镜像、容器、卷、网络等）都会默认存储在新硬盘的 /data/docker 目录，实现：  
系统盘与数据盘分离，避免系统盘因镜像过多占满；  
新盘容量更大，可存储更多 Docker 镜像和容器数据。  
后续所有 docker pull、docker build 生成的镜像，都会自动存储在新盘，无需额外操作。

