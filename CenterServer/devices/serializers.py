from dataclasses import fields
from rest_framework import serializers
from devices.models import *


class DevicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = '__all__'
        
class ModelMachineLeaningSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelML
        fields = '__all__'
        
class BlackListIPSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlackListIP
        fields =  '__all__'

class WhiteListIPSerializer(serializers.ModelSerializer):

    class Meta:
        model = WhiteListIP
        fields =  '__all__'
        
class AlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerts
        fields = '__all__'
        
class AlertsFilterSerializer(serializers.ModelSerializer):
    status = serializers.JSONField(default=list)
    type = serializers.JSONField(default=list)
    timestamp = serializers.JSONField(default=list)
    device = serializers.JSONField(default=list)
    class Meta:
        model = Alerts
        fields =['status','type','timestamp','device']

class DevicesMailCheckSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DevicesMailCheck
        fields = "__all__"


class DevicesSMSCheckSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DevicesSMSCheck
        fields = '__all__'
        

class AlertsExportSerializer(serializers.ModelSerializer):
    status = serializers.JSONField(default=list)
    type = serializers.JSONField(default=list)
    timestamp = serializers.JSONField(default=list)
    device = serializers.JSONField(default=list)
    class Meta:
        model = Alerts
        fields =['status','type','timestamp','device']

class DeviceDistributedThresholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceDistributedThreshold
        fields = '__all__'

class DeviceDistributedThresholdDataSerializer(serializers.ModelSerializer):
    analyzer_ip = serializers.CharField(required=False)
    class Meta:
        model = DeviceDistributedThreshold
        fields = (
            'id',
            'check',
            'check_receive',
            'analyzer_ip',
            'min_latency',
            'min_used_ram',
            'min_load_cpu',
        )
        extra_kwargs = {
            'analyzer_ip': {'required': False}
        }