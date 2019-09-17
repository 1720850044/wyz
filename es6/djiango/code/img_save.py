# coding=utf-8
import requests


resp = requests.get("https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=305050952,157808643&fm=85");

with open("1.png","wb") as f:
    f.write(resp.content)