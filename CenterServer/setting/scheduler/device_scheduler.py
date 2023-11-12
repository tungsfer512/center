from pathlib import Path
from apscheduler.schedulers.background import BackgroundScheduler
from devices.views import *
from setting.views import *
import os

#create scheduler that auto change password
scheduler = BackgroundScheduler()

def start():
    contents = Path('/CenterServer/.env.dev').read_text()
    arr = contents.split(chr(10))
    print(arr)
    autoUpdateWhiteList = "-1"
    autoUpdateBlackList = "-1"
    autoSendMail = "-1"
    autoSendSms = "-1"
    autoSendTele = "-1"
    for item in arr:
        if (item.find('AUTO_UPDATE_WHITELIST_SECOND') != -1):
            autoUpdateWhiteList = item.split("=")[1]
        if (item.find('AUTO_UPDATE_BLACKLIST_SECOND') != -1):
            autoUpdateBlackList = item.split("=")[1]
        if (item.find('AUTO_SEND_MAIL_SECOND') != -1):
            autoSendMail = item.split("=")[1]
        if (item.find('AUTO_SEND_SMS_SECOND') != -1):
            autoSendSms = item.split("=")[1]
        if (item.find('AUTO_SEND_TELE_SECOND') != -1):
            autoSendTele = item.split("=")[1]

    if autoUpdateWhiteList != "-1":
        scheduler.add_job(AutoGetBlackListView.auto_get_blacklist, "interval", seconds=int(autoUpdateWhiteList), id = "device_sched_01", replace_existing = True)
    if autoUpdateBlackList != "-1":
        scheduler.add_job(AutoGetWhiteListView.auto_get_whitelist, "interval", seconds=int(autoUpdateBlackList), id = "device_sched_02", replace_existing = True)
    if autoSendMail != "-1":
        scheduler.add_job(AutoSendMailView.auto_send_mail, "interval", seconds=int(autoSendMail), id = "device_sched_03", replace_existing = True)
    if autoSendSms != "-1":
        scheduler.add_job(AutoSendSmsView.auto_send_sms, "interval", seconds=int(autoSendSms), id = "device_sched_04", replace_existing = True)
    if autoSendTele != "-1":
        scheduler.add_job(AutoSendTeleView.auto_send_tele, "interval", seconds=int(autoSendSms), id = "device_sched_05", replace_existing = True)

    print(scheduler.get_jobs())
    if autoUpdateWhiteList == "-1" and autoUpdateBlackList == "-1" and autoSendMail == "-1" and autoSendSms == "-1" and autoSendTele == "-1":
        print("Don't have any job to run")
        return
    print('start scheduler')
    scheduler.start()

def restart():
    print(scheduler.running)
    if scheduler.running == True:
        print("pause scheduler")
        scheduler.pause()
    contents = Path('/CenterServer/.env.dev').read_text()
    arr = contents.split(chr(10))
    print(arr)
    autoUpdateWhiteList = "-1"
    autoUpdateBlackList = "-1"
    autoSendMail = "-1"
    autoSendSms = "-1"
    autoSendTele = "-1"
    for item in arr:
        if (item.find('AUTO_UPDATE_WHITELIST_SECOND') != -1):
            autoUpdateWhiteList = item.split("=")[1]
        if (item.find('AUTO_UPDATE_BLACKLIST_SECOND') != -1):
            autoUpdateBlackList = item.split("=")[1]
        if (item.find('AUTO_SEND_MAIL_SECOND') != -1):
            autoSendMail = item.split("=")[1]
        if (item.find('AUTO_SEND_SMS_SECOND') != -1):
            autoSendSms = item.split("=")[1]
        if (item.find('AUTO_SEND_TELE_SECOND') != -1):
            autoSendTele = item.split("=")[1]

    scheduler.remove_all_jobs()
    if autoUpdateWhiteList != "-1":
        scheduler.add_job(AutoGetBlackListView.auto_get_blacklist, "interval", seconds=int(autoUpdateWhiteList), id = "device_sched_01", replace_existing = True)
    if autoUpdateBlackList != "-1":
        scheduler.add_job(AutoGetWhiteListView.auto_get_whitelist, "interval", seconds=int(autoUpdateBlackList), id = "device_sched_02", replace_existing = True)
    if autoSendMail != "-1":
        scheduler.add_job(AutoSendMailView.auto_send_mail, "interval", seconds=int(autoSendMail), id = "device_sched_03", replace_existing = True)
    if autoSendSms != "-1":
        scheduler.add_job(AutoSendSmsView.auto_send_sms, "interval", seconds=int(autoSendSms), id = "device_sched_04", replace_existing = True)
    if autoSendTele != "-1":
        scheduler.add_job(AutoSendTeleView.auto_send_tele, "interval", seconds=int(autoSendSms), id = "device_sched_05", replace_existing = True)

    print(scheduler.get_jobs())
    if autoUpdateWhiteList == "-1" and autoUpdateBlackList == "-1" and autoSendMail == "-1" and autoSendSms == "-1" and autoSendTele == "-1":
        print("Don't have any job to run")
        return
    if scheduler.running == False:
        print("start scheduler")
        scheduler.start()
        return
    print("resume scheduler")
    scheduler.resume()