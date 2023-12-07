import redis
import os
from dotenv import dotenv_values

r = redis.Redis(host=os.getenv('REDIS_SERVER'), port=6379, db=0)

def set_env():
    print("=========================" + "env_dev.py" + "=========================")
    r.set("AUTO_UPDATE_WHITELIST_SECOND", "-1")
    r.set("AUTO_UPDATE_BLACKLIST_SECOND", "-1")
    r.set("AUTO_SEND_MAIL_SECOND", "-1")
    r.set("AUTO_SEND_SMS_SECOND", "-1")
    r.set("SENDER_EMAIL", "kc-iot@ptit.edu.vn")
    r.set("SENDER_APP_PASSWORD", "Passwd2@12345")
    r.set("SENDER_PHONE_PREFIX", "+1")
    r.set("SENDER_PHONE", "6187295681")
    r.set("RECEIVER_PHONE_PREFIX", "+84")
    r.set("TWILIO_ACCOUNT_SID", "AC6f7794144d5caa4d95ed2dcbab41ac50")
    r.set("TWILIO_AUTH_TOKEN", "9a4f8c604d9d1c26b668ccf5cecd6e83")
    r.set("AUTO_SEND_TELE_SECOND", "-1")
    r.set("TELEGRAM_BOT_API_TOKEN", "6340000511:AAHRacEXR8AfXKZOAp14NAm7VRFgG6Gjt2I")
    r.set("AUTO_GET_DISTRIBUTED_LIST_SECONDS", "30")

def get_env(key, default_value=None):
    value = r.get(key).decode("utf-8")
    if value:
        print("=========================" + f"GET REDIS env_dev - {key}" + "=========================")
        return value
    else:
        print("=========================" + f"GET ENV env_dev - {key}" + "=========================")
        config = dotenv_values("/CenterServer/.env.dev")
        return config.get(key, default_value)

def update_env(key, value):
    print("=========================" + f"UPDATE env_dev - {key}" + "=========================")
    r.set(key, value)