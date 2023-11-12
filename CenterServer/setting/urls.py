from django.urls import path, include
from . import views 

urlpatterns = [
    path('settings/agent_hash', views.AgentHashView.as_view()),
    path('settings/agent_hash/<str:filename>', views.AgentHashDownloadView.as_view()),
    path('settings/manual-get-blacklist', views.AutoGetBlackListView.as_view()),
    path('settings/manual-get-whitelist', views.AutoGetWhiteListView.as_view()),
    path('settings/auto-get-blacklist', views.AutoGetBlacklist.as_view()),
    path('settings/auto-get-blacklist/srcs', views.BlackListSrcsView.as_view()),
    path('settings/auto-get-blacklist/srcs/<int:id>', views.BlacklistSrcByIdView.as_view()),
    path('settings/auto-get-blacklist/<int:seconds>', views.PutAutoGetBlacklist.as_view()),
    path('settings/auto-get-whitelist', views.AutoGetWhitelist.as_view()),
    path('settings/auto-get-whitelist/srcs', views.WhiteListSrcsView.as_view()),
    path('settings/auto-get-whitelist/srcs/<int:id>', views.WhitelistSrcByIdView.as_view()),
    path('settings/auto-get-whitelist/<int:seconds>', views.PutAutoGetWhitelist.as_view()),
    path('settings/email-sms', views.EmailSMSView.as_view()),
]