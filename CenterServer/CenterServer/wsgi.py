"""
WSGI config for CenterServer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

pathEnv = "/CenterServer/.env.dev"

import os
from ksql import KSQLAPI
import json
import datetime
import threading
import time
import redis

try:
    client = KSQLAPI('http://ksqldb-server:8088')
    try:
        client.create_stream(table_name="data_info",
                        columns_type=["mac_addr varchar","hostname varchar","src_server_private_ip varchar","cpu_percent double","mem_used double","network_latency double", "check_receive varchar"],
                        topic=os.getenv('TOPIC_SEND_SERVER'),
                        value_format="json")
    except:
        print("==========================da ton tai stream")

    query = client.query(f'select  * from data_info emit changes;')

    def getquery():

        try:
            redis_center = redis.Redis(host=os.getenv('REDIS_SERVER'), port=6379, db=0)
            for records in query:
                if "row" in records:
                    # print(records[0:-2])
                    r = json.loads(records[0:-2])
                    row=r["row"]
                    ip_analyzer = row["columns"][4]
                    cpu = row["columns"][5]
                    ram = row["columns"][6]
                    latency = row["columns"][7]
                    check_receive = row["columns"][8]
                    if not cpu:
                        cpu=-1
                    if not ram:
                        ram=-1
                    if not latency:
                        latency=-1
                    print(ip_analyzer," ",cpu," ",ram, " ", check_receive)
                    analyzer_list=redis_center.get("analyzer_list")
                    if analyzer_list:
                        string_analyzer_list = redis_center.get("analyzer_list").decode("utf-8").replace("'",'"')
                        analyzer_list= json.loads(string_analyzer_list)
                    else: analyzer_list=[]
                    if not ip_analyzer in analyzer_list:
                        analyzer_list.append(ip_analyzer)
                    redis_center.set("analyzer_list",f'{analyzer_list}')
                    cpu_ram = '{'+f'"cpu":{cpu},"ram":{ram},"latency":{latency},"check_receive":{check_receive}'+'}'
                    redis_center.set(ip_analyzer,cpu_ram)
        except Exception as e:
            print(e)
            print("======================ket thuoc luong")

    t1 = threading.Thread(target=getquery, args=())

    t1.start()
except Exception as e:
    print("==========================khong the ket noi den ksql", e)
    

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CenterServer.settings')

application = get_wsgi_application()
