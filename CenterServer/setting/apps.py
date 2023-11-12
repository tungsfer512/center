from django.apps import AppConfig
from pathlib import Path
pathEnv = '/CenterServer/.env.dev'

class Setting(AppConfig):
    name = 'setting'
    # def ready(self):
        # print("Scheduler reset time to -1 ...")
        
        # contents = Path(pathEnv).read_text()
        # # print(contents)
        # # print("------------------")
        # arr = contents.split(chr(10))
        # print(arr)
        # for i in range(len(arr)):
        #     if (arr[i].find('AUTO_UPDATE_BLACKLIST_SECOND') != -1):
        #         arr[i] = 'AUTO_UPDATE_BLACKLIST_SECOND=' + str(-1)
        #     if (arr[i].find('AUTO_UPDATE_WHITELIST_SECOND') != -1):
        #         arr[i] = 'AUTO_UPDATE_WHITELIST_SECOND=' + str(-1)
        #     # pass
        # res = ""
        # for i in range(len(arr)):
        #     res += arr[i]
        #     if i < len(arr) - 1:
        #         res += chr(10)
        # # print(res)
        # open(pathEnv, 'w').close()
        # f = open(pathEnv, 'w')
        # f.write(res)
        # f.close()
        # # print("------------------")
        # print("Scheduler running ...")
        # from .scheduler import device_scheduler
        # device_scheduler.start()

