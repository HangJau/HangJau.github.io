---
layout: source
title: Python生活-定时发送新闻联播到微信
cover: https://s1.locimg.com/2024/09/11/bd9d10a0998d7.png
date: 2023-07-09 21:20:20
categories: 一些脚本
tags: 
    - Python
    - 新闻
---


分享一个脚本，通过Python开发的一个新闻联播推送脚本。该项目应用场景广泛炒股的大佬们，新闻工作者，要考公的未来接班人以及需要了解国家大事的，都可以通过这个快速的获取到新闻联播信息。

免去了定时要去观看30分钟的新闻视频。直接文字输出新闻联播，一字不差。直接推送到微信邮箱(微信中的QQ邮箱提醒中绑定的邮箱)


### 代码

项目中分为两部分第一部分通过新闻联播地址获取新闻联播的文字内容，第二部分将文字内容发送到邮箱

我们来看下关键部分获取新闻联播的文字内容

```python
import re
import requests
from lxml import etree
import datetime
import yagmail

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4651.0 Safari/537.36'
}


# 获取新闻
def get_hanlder(url):
    try:
        rsp = requests.get(url, headers=headers, timeout=5)
        rsp.raise_for_status()
        rsp.encoding = rsp.apparent_encoding
        # print(rsp.text)
        return rsp.text
    except requests.RequestException as error:
        print(error)
        exit()


def get_news(url):
    rsp = get_hanlder(url)

    etr = etree.HTML(rsp)
    titles = etr.xpath("//li/a/text()")
    hrefs = etr.xpath("//li/a/@href")

    news = []
    summary = None
    for title, href in zip(titles, hrefs):
        if '《新闻联播》' in title:
            # 获取新闻概要
            title_rsp = get_hanlder(href)
            summary = re.search(r'<div class="video_brief">本期节目主要内容：[\s\S]*。', title_rsp).group(
                0) + "</div>\n\n\n"
            continue

        # 新闻标题去掉视频并处理成超链接  橙色 #D2691E
        tit = re.sub(r"\[视频\]?", "", title)

        subtitle = f'<a href=\"{href}\" style="color:#4682B4"><b>{tit}</b></a>'
        summary = re.sub(tit, subtitle, summary)

        # 获取新闻正文并添加到news
        news_text = get_hanlder(href)

        news_th = re.findall(r'<div class="content_area" id="content_area">.*</div>', news_text)[0]

        news.append(f"{subtitle}\n{news_th}")

    news.insert(0, summary)
    return news


def email_send(rsp, strdate):
    # 发送数据到邮箱 此处发送端为QQ邮箱
    yag = yagmail.SMTP(user='yourQQ@qq.com', password='your send code', host='smtp.qq.com', port=465)
    yag.send(to=["acceptQQ1@qq.com", "acceptQQ2@qq.com"], subject=f"{strdate}日新闻联播推送", contents=rsp)
    print('邮件已发送请查收...')

# event,context这两个参数不同的厂商是不同的名称，请根据厂商的示例进行修改即可
def scf_run(event, context):
    # 获取日期这里默认为第二天获取前一天的所以-1,若是当天获取则无需-1改为0即可
    strTime = (datetime.date.today() + datetime.timedelta(-1)).strftime("%Y%m%d")

    url = f'https://tv.cctv.com/lm/xwlb/day/{strTime}.shtml'

    news_text = get_news(url)

    email_send(news_text, strTime)

# 若部署在云函数上请把下面这行注释掉,非云函数上不用注释
scf_run(1,2)

```
代码释义：
首先将新闻联播页面通过Xpath获取我们需要获取的新闻联播的标题以及链接。再将链接和标题进行绑定循环取出并获取内容。
将获取的内容作为邮件的内容进行发送

tips:

1、默认调用时是获取前一天的内容，若需要获取当天的请把里面(datetime.date.today() + datetime.timedelta(-1)).strftime("%Y%m%d") 这段代码中的“-1”修改为“0”，若当天执行时为20:00前可能会获取不到因为当天的新闻还没出来

2、请注意修改发送者的邮箱和开启SMTP服务后的秘钥

### 邮件展示

![邮件展示](https://im.gurl.eu.org/file/327217c814cecb814371b.png)

### 定时发送

定时发送这里有两个选择，第一种就是自己有服务器，通过crontab 进行定时调用。第二种就是通过各大云厂商的云函数进行部署，设定函数触发时间即可。重要的是不需要掏服务器钱，云函数的每月免费额度以及够用了。（目前华为云的云函数是可以免费额度）
