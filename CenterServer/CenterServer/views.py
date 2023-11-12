
import logging
logger = logging.getLogger(__name__)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.authtoken.models import Token
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        ## This data variable will contain refresh and access tokens
        data = super().validate(attrs)
        token = Token.objects.get( user_id = self.user.id)
        ## You can add more User model's attributes like username,email etc. in the data dictionary like this.
        data['user_name'] = self.user.username
        data['email'] = self.user.email
        data['id'] = self.user.id
        data['auth_token'] = str(token)
        return data
        

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
