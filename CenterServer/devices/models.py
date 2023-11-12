from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils import timezone
import os
from elasticsearch import Elasticsearch
import datetime

class Devices(models.Model):
    ip = models.CharField(max_length=20, blank=True, default='', unique=True)
    port = models.IntegerField(default=8000)
    name = models.CharField(max_length=50)
    domain = models.CharField(max_length=50)
    protocol = models.CharField(max_length=10)
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    mac_addr = models.CharField(max_length=50, unique=True, null=True)
    status = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', default='device.jpg')
    email = models.CharField(max_length=128, null=True)
    phone = models.CharField(max_length=50, null=True)
    address = models.CharField(max_length=255, null=True)
    telegram_id = models.CharField(max_length=50, null=True)
    
class Meta:
    ordering = ['created']



class ModelML(models.Model):
    file = models.FileField(
        upload_to="models/",
        validators=[FileExtensionValidator(allowed_extensions=['h5'])]
    )
    category = models.CharField(max_length=255)
    version = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)
    use = models.BooleanField(default=False)

class WhiteListIP(models.Model):
    ip = models.CharField(max_length=20,unique=True,)
    url = models.CharField(max_length=50, default='', null=True)
    created = models.DateTimeField(null=True, default=timezone.now)
    class Meta:
        unique_together = (('ip'),)
        ordering = ['created']
        
class BlackListIP(models.Model):
    ip = models.CharField(max_length=20,unique=True,)
    url = models.CharField(max_length=50, default='', null=True)
    created = models.DateTimeField(null=True, default=timezone.now)
    class Meta:
        unique_together = (('ip'),)
        ordering = ['created']
        
class Alerts(models.Model):
    ATTACK_TYPE = (
        ('NETWORK', 'Tấn công mạng'), ('MALWARE', 'Mã độc'),
        ('SYSCALL', 'Lời gọi hệ thống'), ('LOG', 'LOGS'), ("IPS", "Snort")
    )
    STATUS_TYPE = (
        ('DA_XU_LY', 'Đã xử lý'),
        ('CHUA_XU_LY', 'Chưa xử lý')
    )
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, default=1)
    ip = models.CharField(max_length=20, blank=True, default='')
    hash = models.CharField(max_length=50, blank=True, default='')
    pid = models.CharField(max_length=8, blank=True, default='')
    timestamp = models.DateTimeField()
    rule_base = models.CharField(max_length=200, blank=True, default='')
    log = models.TextField(blank=True, default='')
    status = models.CharField(choices=STATUS_TYPE, max_length=50, default='CHUA_XU_LY')
    message = models.CharField(max_length=200, blank=True, default='')
    type = models.CharField(choices=ATTACK_TYPE, max_length=50, default='NETWORK')
    address = models.TextField(blank=True, default='')
    

class DevicesMailCheck(models.Model):
    
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, null=False)
    network = models.BooleanField(default=False, null=False)
    malware = models.BooleanField(default=False, null=False)
    syscall = models.BooleanField(default=False, null=False)
    log = models.BooleanField(default=False, null=False)
    ips = models.BooleanField(default=False, null=False)
    
    class Meta:
        db_table = "devices_mail_check"


class DevicesSMSCheck(models.Model):
    
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, null=False)
    network = models.BooleanField(default=False, null=False)
    malware = models.BooleanField(default=False, null=False)
    syscall = models.BooleanField(default=False, null=False)
    log = models.BooleanField(default=False, null=False)
    ips = models.BooleanField(default=False, null=False)
    
    class Meta:
        db_table = "devices_sms_check"
        

class DeviceDistributedThreshold(models.Model):
    
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, null=False, unique=True)
    min_latency =  models.FloatField(default=10.0, null=False)
    min_used_ram =  models.FloatField(default=90.0, null=False)
    min_load_cpu =  models.FloatField(default=90.0, null=False)
    check = models.BooleanField(default=True, blank=True, null=True)
    check_receive = models.BooleanField(default=True, blank=True, null=True)
    class Meta:
        db_table = "device_distributed_threshold"