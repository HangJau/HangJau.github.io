---
title: kali-wsl自定义路径安装
date: 2023-09-23 20:13:28
img: https://w.wallhaven.cc/full/j3/wallhaven-j3vgym.png
categories: 教程
tags:
    - linux
    - wsl
    - kali
---

wsl自定义安装发行路径，记录下安装过程，备份。wsl安装其他分发版本也可以按照该教程进行自定义路径安装。关于wsl以及虚拟化相关功能开启本教程已默认开启，关于开启该功能教程请百度一下。

### 下载离线发行版

浏览器打开下方链接，搜索下载发行版，选择自己需要的分发下载即可。可能需要魔法。

**[wsl分发下载](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)**

![wsl分发](https://e0180ed0.picture-bed-8ov.pages.dev/file/cd40163c3dad0ef84dfd6.jpg)

### 解压分发

下载的发行版，可能会是appx结尾，或者其他结尾，这个不重要，直接用解压缩软件将下载的包直接解压出来。直到看见一个exe文件即可。

注意： exe所在的目录则是该分发的自定义路径。建议执行前将exe文件所在目录的所有文件先移动到自己存放的路径

![解压目录](https://e0180ed0.picture-bed-8ov.pages.dev/file/78508028c1e73fe5320e9.jpg)


### 安装分发

直接双击exe文件会进行初始化，根据提示创建用户和密码即可。当进入到linux里面时证明该wsl已安装完成。你会发现exe所在目录生成了一个磁盘文件vhdx。该文件则是该系统的磁盘文件。

### 汉化
```shell
# 创建一个文件夹用于存放字体
sudo mkdir -p /usr/share/fonts/windows 
# 将Windows系统中的字体导入到kali中
sudo cp -r /mnt/c/Windows/Fonts/*.ttf /usr/share/fonts/windows/
# 下载字体管理器
sudo apt install -y fontconfig

# 打开配置文件  此处需要vi操作知识。建议 vi 进入后 按 G 一定要大写模式 然后按 小写  o  再插入 export的所有命令
sudo vi /etc/profile
# 在上述文件中添加
export LANG=zh_CN.UTF-8
export LANGUAGE=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8
```


其他分发到这里就已经结束，kali的话请继续往下看，由于kali是最小化安装所以需要再安装kali的完整工具包

### KaLi完整安装

#### 检查更新和更新
```shell
sudo apt update && sudo apt -y upgrade
```

#### 安装完整工具包

这里安装可能耗时比较长请耐心等待

```shell
sudo apt install -y kali-linux-large
```

##### 语言选择
![语言](https://e0180ed0.picture-bed-8ov.pages.dev/file/c66fff46094140b49e7a0.png)

##### DHCP
![DHCP](https://e0180ed0.picture-bed-8ov.pages.dev/file/9d5d6e871cc5ec6300aa9.png)

##### wireshark
![wireshark](https://e0180ed0.picture-bed-8ov.pages.dev/file/f0ed0f0210dddeb6d8a28.png)

##### kismet
![kismet](https://e0180ed0.picture-bed-8ov.pages.dev/file/a555be4e903fd54a85e1d.png)

##### sslh
![sslh](https://e0180ed0.picture-bed-8ov.pages.dev/file/18c446ca82df21fe1ada5.png)

#### 验证工具

出现下图情况证明包安装成功，可以愉快的玩耍了

```shell
nmap
```

![nmap](https://e0180ed0.picture-bed-8ov.pages.dev/file/e3ea2cd1ae568f248e5a4.jpg)





