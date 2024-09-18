---
layout: source
title: Python生活-为你的乡愁上一个保险——汽车票监控
cover: https://s1.locimg.com/2024/09/11/bd9d10a0998d7.png
date: 2024-09-13 14:45:36
categories: 实用脚本
tags: 
    - Python
    - 汽车票
---

中秋将至，2024年的你优先出行的方案应该是高铁或者自驾。时间长，乘坐体验不好的长途汽车或许已经被排除在你出行的交通方案之外，哦？！不对应该是早已从记忆中把它移除了。

由于高铁票节假日抢票不好抢，候补随缘。长途汽车实质还是有很多人乘坐特别是省内，在绝大部分人身上时间并不与金钱相等，选择价钱较低，时间长短适中，只要上车就能到达目的地也无不是一种选择。

由于我自己遇到上述情况，便简单写了一个汽车票余票监控脚本，挂公司电脑上每天发送一下即可，方便对出行进行把控。（高铁票一开卖就无票只有候补，挂上候补万一候补不到那不是直接无了。。。故把汽车票也监控上，方便决定）

##### 代码逻辑
1、Python中requests库请求汽车票列表接口

2、获取返回结果通过企微机器人通知到我

下面 上代码~~~

```python
"""
auth: 二一袖
desc: 汽车票监控

run: get_bus_list("出发地", "到达地", "2023-11-09")
"""

import requests
import jmespath

# 发起API请求header 简单伪装一下
headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    'Origin': 'https://bus.ly.com',
    'Pragma': 'no-cache',
    'Referer': 'https://bus.ly.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
}


url = 'https://bus.ly.com/busresapi/schedule/getScheduleList?plateId=3'

def get_bus_list(start, end, date):
    """
    :param start  出发地  成都
    :param end    目的地  金堂县
    :param date   时间  2024-09-15
    """
    data = {
        'departure': start,
        'destination': end,
        'departureDate': date,
        'depId': '',
        'desId': '',
        'page': 1,
        'pageSize': 25,
        'orderTime': 0,
        'orderPrice': 0,
        'dptTimeSpan': '',
        'departureStation': '',
        'arrivalStation': '',
        'hasCategory': True
    }

    try:
        response = requests.post(url,json=data,headers=headers)
        response.raise_for_status()
        result = jmespath.search("body.schedule[?bookingDesc==''].{dptDate:dptDate,dptTime:dptTime,start_station:dptStation,end_station:arrStation,bus_type:coachType,ticketPrice:ticketPrice,ticketLeft:ticketLeft}",response.json())
        # print(result)
        send_msg(result)

    except requests.RequestException as e:
        print(e)

def send_msg(data):
    """
    发送到企业微信机器人
    """
    msgs = ""
    for conf in data:
        msgs += "\n出发时间：{dptDate} {dptTime}\n出发车站：{start_station}\n到达车站：{end_station}\n车型：{bus_type}\n票价：{ticketPrice}\n剩余车票：<font color=\"warning\">{ticketLeft}</font>\n ".format(**conf)

    data = {
        "msgtype": "markdown",
        "markdown": {
            "content": msgs
        }
    }
    
    # 这里我只需要企微通知我一下，若需要其他通知将msgs参数作为传递内容即可
    requests.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={企微机器人key}",
            json=data,
            headers={"Content-Type": "application/json"})


if __name__ == "__main__":
    get_bus_list("成都", "金堂县", "2024-09-15")
```

##### 实现效果
![企微通知](https://s1.locimg.com/2024/09/13/f3d103cfaac0d.png)


##### 结语

本次代码很简单，但是却能帮我们节省时间，提升解决问题的效率。 新手朋友们可以理解一下代码喔