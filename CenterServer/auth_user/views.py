from django.http import JsonResponse
from auth_group.serializers import AuthGroupSerializer
from group_menus.models import GroupMenus
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from auth_user.models import AuthUser, AuthtokenToken
from auth_group.models import AuthGroup
from auth_user.serializers import AuthUserSerializer
from menus.models import Menus
from menus.serializers import MenusSerializer
from django.contrib.auth.hashers import make_password

from auth_user_groups.models import AuthUserGroups

class ResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 1000

def KeySort(e):
    return e["id"]

def add_user_group(*args, list_id_groups=[]): 
    for x in args:
        id_user = x

    arr = AuthUserGroups.objects.filter(user_id=id_user).values_list()
    arr = list(arr)
    for index in range(len(arr)): 
        user_group = get_object_or_404(AuthUserGroups, id=arr[index][0])
        user_group.delete()
    for index in range(len(list_id_groups)): 
        data = AuthUserGroups(user_id=id_user, group_id=list_id_groups[index])
        data.save()
        
class GetCurrentUserInfo(APIView):
    def get(self, request):
        current_user_token = get_object_or_404(AuthtokenToken, key=request.headers['Authorization'].split(' ')[1])
        data = AuthUser.objects.filter(id=current_user_token.user_id).first()
        serializer = AuthUserSerializer(data)
        user_data = serializer.data
        menus = []
        
        user_groups = AuthUserGroups.objects.all().filter(user = user_data["id"])
        xx = list(user_groups.values())
        for user_group in xx:
            group_menus = list(GroupMenus.objects.all().filter(group_id = user_group["group_id"]).values())
            for group_menu in group_menus:
                te_menu = Menus.objects.all().filter(id=group_menu["menu_id"]).first()
                te_menu = MenusSerializer(te_menu).data
                menus.append(te_menu)
        user_data["menus"] = menus

        return JsonResponse({
                'data': user_data
            }, status=status.HTTP_200_OK)

class ListCreateAuthUserView(ListCreateAPIView):
    model = AuthUser
    serializer_class = AuthUserSerializer
    # permission_classes = [permissions.IsAuthenticated]
    queryset = AuthUser.objects.all()
    pagination_class = ResultsSetPagination

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = AuthUserSerializer(queryset, many=True)
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10000))
        total = len(serializer.data)
        start = (page - 1)*limit
        end = min(start + limit, total)
        data = serializer.data
      
      
        for index in range(len(serializer.data)):
            user_groups = AuthUserGroups.objects.filter(user_id=data[index]["id"]).values_list()
            user_groups = list(user_groups)
            groups = []
            for j in range(len(user_groups)):
                groups.append(user_groups[j][2])
            data[index]['groups'] = groups
            # print(user_groups)
        print(data)
        data.sort(reverse=True, key=KeySort)
        return JsonResponse({
                'data': data[start:end],
                'total': total
            }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        list_id_groups = request.data["groups"]
        del data["groups"]
        data["password"] = make_password(data["password"])
        # data["password"] = data["password"][1:]
        try:
            serializer = AuthUserSerializer(data=data)
        except Exception as error:
            print(error)
        if serializer.is_valid():
            serializer.save()
           
            arr = AuthUser.objects.filter(username=data["username"]).values()
            add_user_group(arr[0]["id"], list_id_groups=list_id_groups)

            return JsonResponse({
                'message': 'Create a new AuthUser successful!'
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return JsonResponse({
            'message': 'Create a new AuthUser unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

class UpdateDeleteAuthUserView(RetrieveUpdateDestroyAPIView):
    model = AuthUser
    serializer_class = AuthUserSerializer
    queryset = AuthUser.objects.all()
    # permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = get_object_or_404(AuthUser, id=kwargs.get('pk'))
        data = request.data
        list_id_groups = request.data["groups"]
        del data["groups"]
        print(data)
        serializer = AuthUserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            add_user_group(kwargs.get('pk'), list_id_groups=list_id_groups)
            return JsonResponse({
                'message': 'Update AuthUser successful!'
            }, status=status.HTTP_200_OK)
        print(serializer.errors)
        return JsonResponse({
            'message': 'Update AuthUser unsuccessful!'
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user = get_object_or_404(AuthUser, id=kwargs.get('pk'))
        print(user)
        # auth_token_user = get_object_or_404(AuthtokenToken, user_id=kwargs.get('pk'))
        # print(auth_token_user)
        # auth_token_user.delete()
        user.delete()

        return JsonResponse({
            'message': 'Delete AuthUser successful!'
        }, status=status.HTTP_200_OK)