from rest_framework import serializers 
from .models import *

class BlacklistSrcSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlacklistSrc
        fields = "__all__"

class WhitelistSrcSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhitelistSrc
        fields = "__all__"

