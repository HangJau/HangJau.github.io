---
layout: source
title: Python生活-当Python遇上可转债(一)
cover: https://s1.locimg.com/2024/09/11/bd9d10a0998d7.png
date: 2024-09-18 09:27:18
categories: 实用脚本
tags: 
    - Python
    - 可转债
---

工作之余，会关注一些可转债的打新和交易，毕竟可转债这种上不封顶，下有保底的债券是不可多得的金融产品。虽然现如今经济不是太稳定，但是有时候能“捡个几百块”还是挺开心的。

捡钱操作就是可转债打新，由于需要自己去检索今天是否有打新，有时候忙其他的就给忘了，导致错失打新机会。另一个问题是金融市场的开盘时间有时候与实际的工作日是不对等的。故利用技能之便写了一个打新提醒。当日可转债可打新就提醒我去打新。


## 代码逻辑
1. 爬虫原理，Python请求当日集思录的投资日历，筛选出当日的可转债打新数据
2. 利用企微，微信，钉钉，飞书等机器人通知打新

### 获取今天的零时时间戳和24时时间戳
首先通过time.strftime 获取今天的日期并按照指定格式输出，然后通过日期组装零时和24时并将其转化为时间戳“day_start_tamp”，“day_end_tamp”。

```Python
def get_calendar():
    """
    获取今天的零时时间戳和24时的时间戳
    :return: tuple: start_tamp, end_tamp
    """
    
    dt = time.strftime("%Y-%m-%d")
    
    start_array = time.strptime(f"{dt} 00:00:00", "%Y-%m-%d %H:%M:%S")
    day_start_tamp = int(time.mktime(start_array))

    end_array = time.strptime(f"{dt} 23:59:59", "%Y-%m-%d %H:%M:%S")
    day_end_tamp = int(time.mktime(end_array))

    return day_start_tamp, day_end_tamp

```


### 对投资日历接口发起请求并做数据处理
1、将上一步中当日的零时和24时的时间戳依次传入发起请求并返回json数据--“get_api”函数

2、将返回的结果筛选出我们需要的打新数据--“handle_rsp”函数
```Python
def get_api(self, start_tamp, end_tamp):
        """
        获取某一时间范围内的数据
        :param start_tamp: timetamp(10):开始时间
        :param end_tamp: timetamp(10):结束时间
        :return: json: response
        """

        API = "/data/calendar/get_calendar_data/"
        params = {
            "qtype": "CNV",
            "start": start_tamp,
            "end": end_tamp,
            "_": int(time.time() * 1000)
        }
        try:
            rsp = self.session.get(self.domain + API, params=params, verify=False)
            rsp.raise_for_status()
            return rsp.json()

        except Exception as e:
            print(e)

def handle_rsp(rsp):
    """
    获取response中含申购日的title信息并提取申购名称
    :param rsp: json: json化的响应
    :return: str: 处理好的消息
    """
    str_lists = jmespath.search("[?contains(title,'【申购日】') ==`true`].title", rsp)
    str_iterators = map(lambda x: x.lstrip("【申购日】"), str_lists)
    str_name = "\n".join(str_iterators)
    return str_name
```


### 消息格式化并发送
1、将“handle_rsp”函数处理的数据进行格式化，也就是我们能够看到的文字格式。

2、将格式化的数据通过企微机器人进行消息推送

```Python
def message_format(self, info):
    """
    消息组装格式化
    :param info: str:需要组装的消息
    :return: str: 发送的格式化消息
    """
    week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]
    template = f"今天({self.day}) {week[self.day.weekday()]}\n\n可转债申购列表:\n"
    return template + info

def send_msg(self, msg):
    """
    发送消息到企业微信
    :param msg: str: 需要发送的消息
    """
    data = {
        "msgtype": "text",
        "text": {
            "content": msg
        }
    }

    requests.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={企微机器人key}",
                    json=data,
                    headers={"Content-Type": "application/json"})
```


## 完整代码
```Python
import urllib3
import datetime
import time
import requests
import jmespath
from pywchat import Sender

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class BondsCalendar(object):
    """可转债日历类(集思录)

    通过集思录中的投资日历模块, 获取本周和当天的可转债申购信息
    """
    HEADERS = {
        'authority': 'www.jisilu.cn',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'referer': 'https://www.jisilu.cn/data/calendar/',
        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Microsoft Edge";v="110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41',
        'x-requested-with': 'XMLHttpRequest',
    }

    def __init__(self):
        self.session = requests.session()
        self.session.headers = BondsCalendar.HEADERS
        self.domain = "https://www.jisilu.cn"
        self.day = datetime.date.today()

    @staticmethod
    def get_calendar():
        """
        获取今天的零时时间戳和24时的时间戳
        :return: tuple: start_tamp, end_tamp
        """
        
        dt = time.strftime("%Y-%m-%d")
        
        start_array = time.strptime(f"{dt} 00:00:00", "%Y-%m-%d %H:%M:%S")
        day_start_tamp = int(time.mktime(start_array))

        end_array = time.strptime(f"{dt} 23:59:59", "%Y-%m-%d %H:%M:%S")
        day_end_tamp = int(time.mktime(end_array))

        return day_start_tamp, day_end_tamp

    def get_api(self, start_tamp, end_tamp):
        """
        获取某一时间范围内的数据
        :param start_tamp: timetamp(10):开始时间
        :param end_tamp: timetamp(10):结束时间
        :return: json: response
        """

        API = "/data/calendar/get_calendar_data/"
        params = {
            "qtype": "CNV",
            "start": start_tamp,
            "end": end_tamp,
            "_": int(time.time() * 1000)
        }
        try:
            rsp = self.session.get(self.domain + API, params=params, verify=False)
            rsp.raise_for_status()
            return rsp.json()

        except Exception as e:
            print(e)

    @staticmethod
    def handle_rsp(rsp):
        """
        获取response中含申购日的title信息并提取申购名称
        :param rsp: json: json化的响应
        :return: str: 处理好的消息
        """
        str_lists = jmespath.search("[?contains(title,'【申购日】') ==`true`].title", rsp)
        str_iterators = map(lambda x: x.lstrip("【申购日】"), str_lists)
        str_name = "\n".join(str_iterators)
        return str_name

    def message_format(self, info):
        """
        消息组装格式化
        :param info: str:需要组装的消息
        :return: str: 发送的格式化消息
        """
        week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"]
        template = f"今天({self.day}) {week[self.day.weekday()]}\n\n可转债申购列表:\n"
        return template + info

    def send_msg(self, msg):
        data = {
            "msgtype": "text",
            "text": {
                "content": msg
            }
        }

        requests.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={key}",
                      json=data,
                      headers={"Content-Type": "application/json"})

    def run(self):
        tamps = self.get_calendar()
        rsp = self.get_api(*tamps)
        bonds_names = self.handle_rsp(rsp)

        # 判断今日是否有打新，无则不发送消息
        if not bonds_names:
            return
        msg_info = self.message_format(bonds_names)
        self.send_msg(msg_info)

# 执行
bond = BondsCalendar()
bond.run()
```
