---
layout: .
title: Linux安装docker
date: 2023-08-27 14:55:47
cover: https://e0180ed0.picture-bed-8ov.pages.dev/file/9d7801894409a6629d28d.png
categories: 教程
tags: 
    - docker
    - linux
---

记录下docker服务的安装，目前只涉及到了centos系统，此贴会记录博主在不同系统中的docker安装教程。(其他的什么时候更新就看博主啥时候遇到了)

### CentOS docker 安装

#### 清除已安装的部分(若是新机器可跳过)

```bash
yum remove docker \docker-client \docker-client-latest \docker-common \docker-latest \docker-latest-logrotate \docker-logrotate \docker-engine
```

#### 前置处理

yum-complete-transaction    清理未完成事务
yum install -y yum-utils    安装依赖工具
yum clean all               清楚未完成的包和缓存
yum  update                 更新

```bash
yum-complete-transaction && yum install -y yum-utils && yum clean all && yum-complete-transaction && yum update
```

#### 安装底层依赖

```bash
yum install -y device-mapper-persistent-data lvm2
```

#### 更新yum缓存
```bash
yum makecache fast
```

#### 安装docker
```bash
yum install docker-ce docker-ce-cli containerd.io
```

#### 启动docker
```bash
systemctl start docker && systemctl status docker
```

#### 测试运行docker

此步会输出hello-world，输出成功即docker安装成功，就可以愉快的玩耍啦。🎉🎉

```bash
docker run hello-world
```