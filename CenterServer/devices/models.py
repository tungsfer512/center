from django.db import models

class Devices(models.Model):
    ip = models.CharField(max_length=20, blank=True, default='', unique=True)
    name = models.CharField(max_length=50)
    created = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', default='device.jpg')
    email = models.CharField(max_length=128, null=True)
    phone = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=255, null=True)
    telegram_id = models.CharField(max_length=50, null=True)
    redis_port = models.IntegerField(default=6379)
class Meta:
    ordering = ['created']