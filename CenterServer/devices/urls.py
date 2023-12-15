from django.urls import path, include
from rest_framework.routers import DefaultRouter
from devices import views
# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'IoTAnalyzerDevices', views.IoTAnalyzerDevicesView)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('devices/best-analyzer', views.BestAnalyzer.as_view()),
]
