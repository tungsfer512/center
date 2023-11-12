import threading
import json 
from kafka import KafkaConsumer
from _thread import start_new_thread
import time

# if __name__ == '__main__':
# Kafka Consumer 
consumer = KafkaConsumer(
    bootstrap_servers='192.168.10.252:9092',
    auto_offset_reset='earliest',
    enable_auto_commit=True
)
max_ma = ""
def test(topic):
    global max_ma
    consumer.subscribe(topic)
    for i, message in enumerate(consumer):
        print(json.loads(message.value.decode()))
        
def test1():
    global max_ma
    while True:
        time.sleep(1)
        print(max_ma)

def get_max():
    global max_ma
    return max_ma
 
if __name__ =="__main__":
    # creating thread
    t1 = threading.Thread(target=test, args=("redis_center_server",))
 
    # starting thread 1
    t1.start()
    # starting thread 2
    print("Done!")