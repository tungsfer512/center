from rest_framework import serializers 
from auth_group.models import AuthGroup
 
 
class AuthGroupSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = AuthGroup
        fields = ('__all__')