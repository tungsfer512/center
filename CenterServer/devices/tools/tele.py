
import requests
from CenterServer.env_dev import *

def send_to_telegram(message, chat_id):

    apiToken = f'{get_env("TELEGRAM_BOT_API_TOKEN")}'
    chatID = chat_id
    apiURL = f'https://api.telegram.org/bot{apiToken}/sendMessage'

    try:
        response = requests.post(apiURL, json={'chat_id': chatID, 'text': message})
        print(response.text)
    except Exception as e:
        print(e)