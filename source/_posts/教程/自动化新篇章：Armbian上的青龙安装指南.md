---
layout: .
title: 自动化新篇章：Armbian上的青龙安装指南
date: 2024-09-23 09:39:28
cover: https://s1.locimg.com/2024/09/11/92d56262b8304.png
categories: 教程
tags:
    - linux
    - armbian
    - 魔百和
    - M401A
---


前面老赵，已经将购买的机顶盒刷成了armbian并已安装了docker，不知道怎么刷的可以看下机顶盒秒变服务器这篇文章。接下来咱们开始进阶安装自动化平台，方便我们更好的利用这个“机顶盒”。 

## 准备工作
* 电脑一台 (肯定要能连接到armbian上的哈)
* ssh软件(登录到armbian需要。刚需!! 常用的[putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) [xshell](https://www.xshell.com/zh/free-for-home-school/))

## docker服务确认
```shell
# 重启docker服务若未启动则启动，已启动则重启保证
service docker restart


# 查看docker服务状态 看到running，active 即可
service docker status
```

## 下载并启动自动化平台
这里老赵找到了一键安装脚本，小白友好直接一路回车就行(脚本安全！！)
```shell
# 执行下面命令 一路根据提示回车就行
wget -q https://raw.githubusercontents.com/Oreomeow/VIP/main/Scripts/sh/ql.sh -O ql.sh && bash ql.sh
```
![一键脚本](https://s1.locimg.com/2024/09/26/f76d6bc1e328f.png)

#### 青龙初始化
当以上步骤都执行和检查完成后，那这时已经成功99%，现在让我们通过自己电脑的浏览器打开网页“http://{机顶盒IP:5700}”进行初始化平台。

初次打开会有初始化过程如下，通知可以暂时先跳过
![青龙网页](https://s1.locimg.com/2024/09/25/8b927ccfd53cb.png)

![通知](https://s1.locimg.com/2024/09/25/37bcb702043ee.png)

![账户](https://s1.locimg.com/2024/09/25/b2568f8d0afe1.png)

![完成](https://s1.locimg.com/2024/09/25/b5e3fe249f973.png)


## 青龙使用
以上青龙面板已经搭建好了，现在可以愉快的玩耍了，先教大家如何进行任务上传执行和依赖安装。可以从本地上传和网络仓库中下载。这里先说一下本地上传吧。

![青龙](https://s1.locimg.com/2024/09/25/386065408b67e.png)

### 依赖安装
进入依赖管理，右上角“新建依赖”。选择Python3，输入需要安装的依赖名称即可。
![安装依赖](https://s1.locimg.com/2024/09/26/aebab23e15f87.png)

Tips:

    后续脚本缺什么依赖就安装什么依赖就好

### 本地脚本同步平台
首先进入左侧脚本管理模块，然后点击右上角 “+” 号 选择本地文件，然后点击上传选择“本地文件” 点击确定就OK
![本地文件](https://s1.locimg.com/2024/09/25/f32389cba0265.png)


Tips:

    上传成功后直接点保存，你若需要修改就修改一下后进行保存。

### 脚本的自动化运行
点击定时任务,右上角新建任务，输入名称、执行命令、定时规则后直接点确定。定时任务就设定好了，咱们就不用管了。它会在我们设定的时候执行并发通知。

![创建任务](https://s1.locimg.com/2024/09/26/612c8c73a3531.png)

Tips:
    
    定时规则是crontab形式，不懂的可以百度搜一下很简单的，我上面的标识就是每天10点执行一次


## 结语
青龙应用很多人都在用，用来干什么也千奇百怪，大部分都是拿来薅羊毛的，有jd签到拿京豆的，也有各种极速版薅金币的，也有做b站任务升级账号的。想要薅羊毛的，我这里也有资源和项目。关注发送“羊毛”获取资源，不保证一定能薅呢。另外我自己所写的一些实用脚本都可以在该平台使用，方便你我他。


