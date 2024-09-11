---
layout: .
title: linux下v2ray客户端安装
cover: https://s1.locimg.com/2024/09/10/9fd1a5776f1da.png
date: 2023-12-16 21:12:15
categories: 教程
tags:
  - v2ray
  - linux
  - docker
  - armbian
---

为了在armbian上搭建一个v2ray的客户端供armbian使用，毕竟有些程序需要跑在armbian服务器上，linux同理。本次教程安装的v2rayA，使用web进行管理，方便。 使用docker进行搭建，请提前安装好docker


### 准备工作
1. docker（略）
2. 放开防火墙
```shell
# 安装ufw防火墙工具
apt install ufw
# 关闭防火墙
ufw disable 
```

### 安装
```shell
docker pull mzz2017/v2raya
```

### 启动
```shell
docker run -d \
  --restart=always \
  --privileged \
  --network=host \
  --name v2raya \
  -e V2RAYA_LOG_FILE=/tmp/v2raya.log \
  -e V2RAYA_V2RAY_BIN=/usr/local/bin/v2ray \
  -e V2RAYA_NFTABLES_SUPPORT=off \
  -v /lib/modules:/lib/modules:ro \
  -v /etc/resolv.conf:/etc/resolv.conf \
  -v /etc/v2raya:/etc/v2raya \
  mzz2017/v2raya
```
查看运行状态
![运行](https://e0180ed0.picture-bed-8ov.pages.dev/file/8d61972f09fd6e5954124.jpg)


### 修改部分配置
浏览器打开v2raya地址
   ```
   armbianIP:2017
   ```

首次进入会要求创建一个账户和密码进行管理

进入后导入订阅或添加服务端配置

设置中将端口转发开启，则放开了对应设置的各项端口，可在关于中查看

![端口分享](https://e0180ed0.picture-bed-8ov.pages.dev/file/68ebc356db06bda4c51d2.jpg)

### 更新
需要更新v2raya，非常方便，直接再次拉取一次镜像，将已启动的容器直接停止并删除，重新使用启动命令再启动一个即可，配置等已经在宿主机有保留。不必担心会丢失。
```shell
# 更新
docker pull mzz2017/v2raya

# 停止容器
docker stop v2raya

# 删除容器
docker rm v2raya

# 启动新的容器
docker run -d \
  --restart=always \
  --privileged \
  --network=host \
  --name v2raya \
  -e V2RAYA_LOG_FILE=/tmp/v2raya.log \
  -e V2RAYA_V2RAY_BIN=/usr/local/bin/v2ray \
  -e V2RAYA_NFTABLES_SUPPORT=off \
  -v /lib/modules:/lib/modules:ro \
  -v /etc/resolv.conf:/etc/resolv.conf \
  -v /etc/v2raya:/etc/v2raya \
  mzz2017/v2raya
```


### 非docker安装
可以使用该地址中的命令直接安装

**https://github.com/v2rayA/v2rayA-installer**


#### 可参考
###### v2raya项目地址: 
https://github.com/v2rayA/v2rayA

###### v2raya docker地址：
https://hub.docker.com/r/mzz2017/v2raya

###### v2raya 文档地址(需要魔法)：
https://v2raya.org/docs/prologue/introduction/