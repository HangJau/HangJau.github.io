---
layout: .
title: armbian下安装Openwrt-Docker版
date: 2023-12-09 20:27:15
cover: https://s1.locimg.com/2024/09/10/9269e147e02c2.jpg
categories: 教程
tags:
  - 机顶盒
  - armbian
  - docker
  - 旁路由
  - openwrt
---

前面将机顶盒刷写成armbian也已经安装docker，现在通过docker安装openwrt将armbian当做旁路由使用。主要还是为了解决家庭局域网爬梯问题。

### 准备工作
1. 安装docker(略)
2. 拉取openwrt镜像

```shell
# 拉取openwrt 镜像
 docker pull unifreq/openwrt-aarch64
```
openwrt-docker镜像地址：https://hub.docker.com/r/unifreq/openwrt-aarch64


### 网卡混杂模式

```shell
ip link set eth0 promisc on
```

### 创建网络
```
docker network create -d macvlan --subnet=192.168.1.0/24 --gateway=192.168.1.1 -o parent=eth0 macnet
```

--subnet: macvlan 网络所在的网络(一般就为自己的网段)

--gateway: 网关IP

-o parent: 用来分配 macvlan 网络的物理网卡

### 查看网络
```shell
docker network ls
```
![网络列表](https://e0180ed0.picture-bed-8ov.pages.dev/file/20804a816929d345a33e7.png)


### 运行镜像
```shell
docker run \
  -d \
  --name=openwrt \
  --restart=unless-stopped \
  --network=macnet \
  --privileged \
  --ip=192.168.1.8 \
  unifreq/openwrt-aarch64:latest
```
--ip: 容器在网络中的IP

![运行成功](https://e0180ed0.picture-bed-8ov.pages.dev/file/785d255759cf3636e6854.jpg)

### 指定LAN口和网关

```shell
#第一次运行，需要修改ip地址，lan口网络（192.168.1.7）和网关（192.168.1.1）
docker exec openwrt sed -e "s/192.168.1.1/192.168.1.7/" -i /etc/config/network

#重启容器
docker restart openwrt
```
![配置网络并重启](https://e0180ed0.picture-bed-8ov.pages.dev/file/10a33fedb89351532e579.jpg)


### 使用openwrt
浏览器打开 http://192.168.1.7 即可(上面配置IP)

![](https://file.mlapp.cn/usr/uploads/2019/10/1570427399298.png)






