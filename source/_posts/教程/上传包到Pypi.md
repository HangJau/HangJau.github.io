---
title: 上传包到Pypi，共享给全球用户
date: 2024-01-26 21:48:55
img: 
categories: 教程
tags:
    - Python
    - Pypi
    - 打包
---

本文章记录将自己的Python包发布到Pypi上，供全球用户使用。

#### 构建包安装
```shell
# 安装打包工具和上传工具
python -m pip install build twine
```

#### 你的项目结构分布
![项目结构](https://e0180ed0.picture-bed-8ov.pages.dev/file/4f07f9c650ac975de6402.jpg)



#### setup内容
```Python
from setuptools import setup, find_packages

setup(
    name="项目名",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests>=2.22.0"  # 这个只是示例
        # 在这里列出你的库所需的其他Python包
    ],

    author="所有用户",
    author_email="邮箱",
    description="项目简单说明",
    long_description=open("README.md").read(),  # 读取README 文件作为项目介绍
    long_description_content_type="text/markdown", # 文档类型
    license="MIT", # 协议
    url="https://github.com/yourusername/my-awesome-package", # 项目地址
    classifiers=[
        "Programming Language :: Python :: 3",  # 代表支持 所有Python3
        "License :: OSI Approved :: GNU General Public License (GPL)", # lincense 说明
        "Operating System :: OS Independent", # 操作系统

    ],
)
```
#### 构建
```shell
# 构建操作，会在一级目录下生成build，dist等目录 dist则是打包好的文件，一般会是一个tar.gz 或者 whl 
python -m build 
```

#### 上传准备
1. 先注册一个Pypi账户。目前Pypi要求2FA验证登录(可以使用Google Authenticator)
2. 获取一个API令牌
3. 本地用户目录下创建一个.pypirc文件，文件内容如下
```
[pypi]
username = __token__
password = API令牌
```

#### 上传
```shell
# 可检查包是否冲突 可不执行
twine check dist\*

# 上传项目到pypi
twine upload dist\*
```
![上传成功](https://e0180ed0.picture-bed-8ov.pages.dev/file/2b6e4727f5a723b554c79.jpg)


上传后输出包路径则说明上传包成功了，这个时候就可以去[pypi](https://pypi.org/)搜索包名，或者直接打开输出的链接即可。