# coding=utf-8
import requests

headers = {"User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"}
p = {"wd":"传智博客"}
url_temp = "https://www.baidu.com/s?"

r = requests.get(url_temp,headers=headers,params=p)
print (r.status_code)