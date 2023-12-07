from dataclasses import fields
from rest_framework import serializers
from devices.models import *


class DevicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devices
        fields = '__all__'
