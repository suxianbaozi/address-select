#coding:utf8
import requests
import re
import time
import json
base_url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/index.html'

detail_base_url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/'

res = requests.get(base_url)


match_result = re.findall('''href='(\d+\.html)'>([^<]+)<br/></a>''',res.content.decode('gb18030').encode('utf8'))


map_data = []

for item in match_result:
    url,province = item

    province_detail_url = detail_base_url+url

    print province,province_detail_url

    detail_data = {
        "name": province,
        "children": []
    }
    for i in range(4):
        try:
            res2 = requests.get(province_detail_url,headers = {
                "Cookie":"AD_RS_COOKIE=20080917",
                "Referer":"http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/",
                "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36"
            },timeout=5)
            break
        except Exception,e:
            print 'retry ....'
            continue

    city_content = res2.content.decode('gb18030').encode('utf8')
    city_match_result = re.findall('''href='(\d+/\d+\.html)'>([^\d]+)</a>''',city_content)


    for city_info in city_match_result:
        url,city = city_info
        print '---',url,city
        city_data = {
            "name":city,
            "children":[]
        }

        region_detail = detail_base_url + url

        for i in range(4):
            try:
                res3 = requests.get(region_detail,headers = {
                    "Cookie":"AD_RS_COOKIE=20080917",
                    "Referer":"http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2019/",
                    "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36"
                },timeout=5)
                break
            except Exception,e:
                print 'retry ....'
                continue


        region_content = res3.content.decode('gb18030').encode('utf8')
        region_match_result = re.findall('''href='(\d+/\d+\.html)'>([^\d]+)</a>''',region_content)
        for region_url,region_name in region_match_result:
            print '------', region_url, region_name
            city_data['children'].append({
                "name":region_name
            })
        detail_data['children'].append(city_data)
    map_data.append(detail_data)

print json.dumps(map_data)





