from django.contrib.auth.models import User
from rest_framework import serializers 
from auth_user.models import AuthUser
 
 
class AuthUserSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = AuthUser
        fields = ('id',
                  'password',
                  'last_login',
                  'is_superuser',
                  'username',
                  'first_name',
                  'last_name',
                  'email',
                  'is_staff',
                  'is_active',
                  'date_joined')
   
