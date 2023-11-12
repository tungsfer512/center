from django.apps import AppConfig
from pathlib import Path
pathEnv = '/CenterServer/.env.dev'

class DevicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'devices'
    