import json
from time import sleep
import psutil
import os
from time import sleep
import psutil
import time

import time
os.environ['TZ'] = 'Asia/Ho_Chi_Minh'
# time.tzset()
import datetime
import socket
import pika, os, logging
logging.basicConfig()
from getmac import get_mac_address as gma
import sys
class publisher:
    
    def __init__(self,RABBITMQ_DEFAULT_USER,RABBITMQ_DEFAULT_PASS,RABBIT_HOST_NAME, DEVICE_ID):
       
        
        self.mac_addr = gma()
        self.id = DEVICE_ID
        
        self.BROKER_URL = f"amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@{RABBIT_HOST_NAME}:5672/"
           # BROKER_URL = f'amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@{RABBIT_HOST_NAME}:5672/'
        url = os.environ.get('IoTAnalyzer',self.BROKER_URL) #todo
        params = pika.URLParameters(url)
        params.socket_timeout = 5
        connection = pika.BlockingConnection(params) # Connect to CloudAMQP
        self.channel = connection.channel() # start a channel

    def send_mes(self):
        self.channel.queue_declare(queue='data_agent_windows', durable=True,  arguments={'x-message-ttl' : 600000}) # Declare a queue
            # send a message
        
        self.channel.basic_publish(exchange='agent_exchange', routing_key='agent_key', body=self.config_mess())

    def config_mess(self):
        sent_bps,recv_bpsb = Net_load()
        self.mes = json.dumps({
            'type':'windows',
            'PERCENT_CPU': Cpu_Load(),
            'PERCENT_RAM': Ram_load(),
            'timestamp': datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S.%f'),
            'SPEED_UP': sent_bps,
            'SPEED_DOWN':recv_bpsb,
            'ip_agent' : get_ip_address(),
            'MAC': self.mac_addr,
            'id': self.id

        })
        return self.mes
    
def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]
    
def Get_Mac():
    net = psutil.net_if_addrs()
    for i in net:
        for j in net[i]:
            if j.family ==-1:
                print(i," | ",j.address)   #i is interface || j.address is MAC address

def Get_Port():# chưa xong
    output_command = os.popen("netstat -n").readlines()
    print(output_command)

def Net_load(): # hàm chụp 1s 1 lần
    tmp_recv=psutil.net_io_counters(pernic=False, nowrap=True).bytes_recv
    tmp_sent= psutil.net_io_counters(pernic=False, nowrap=True).bytes_sent
    
    tmp_recv_now = psutil.net_io_counters(pernic=False, nowrap=True).bytes_recv
    tmp_sent_now = psutil.net_io_counters(pernic=False, nowrap=True).bytes_sent
    recv_bps = tmp_recv_now - tmp_recv
    sent_bps = tmp_sent_now - tmp_sent
    tmp_recv = tmp_recv_now
    tmp_sent = tmp_sent_now
    return sent_bps,recv_bps

def Cpu_Load():
    return psutil.cpu_percent(interval=0, percpu=False)

def Ram_load():
    return psutil.virtual_memory().percent

def Pid_Run():
    return psutil.pids()

def Get_Pid_All():
    t = time.time_ns()
    link = ".\\data\\system_call\\"  # path out file pid .txt
    out = link + str(t) + ".txt"
    f = open(out, 'w+')
    for proc in psutil.process_iter(['pid', 'name']):  # pid run and stop
        f.write(str(proc))
        f.write('\n')
    print("[ TXT ]=>", out)

def main():
    while 1:
        publisher.send_mes(publisher.config_mess())
        print(publisher.config_mess())
        sleep(5)
if __name__ == "__main__":
    RABBITMQ_DEFAULT_USER = sys.argv[1]
    RABBITMQ_DEFAULT_PASS = sys.argv[2]
    RABBIT_HOST_NAME = sys.argv[3]
    DEVICE_ID = sys.argv[4]
    print(RABBITMQ_DEFAULT_USER,RABBITMQ_DEFAULT_PASS,RABBIT_HOST_NAME)
    abc = publisher(RABBITMQ_DEFAULT_USER, RABBITMQ_DEFAULT_PASS, RABBIT_HOST_NAME, DEVICE_ID)
    while 1:
        abc.send_mes()
        sleep(5)