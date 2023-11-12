from twilio.rest import Client
import os
from CenterServer.env_dev import *

def send_sms(from_, to_, body_):
    account_sid = get_env("TWILIO_ACCOUNT_SID")
    auth_token = get_env("TWILIO_AUTH_TOKEN")
    client = Client(account_sid, auth_token)
    client.messages.create(body=body_, from_=from_, to=to_)