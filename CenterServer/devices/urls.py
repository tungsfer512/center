from django.urls import path, include
from rest_framework.routers import DefaultRouter
from devices import views
# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'alerts', views.AlertsViewSet)
router.register(r'ModelMachineLearning',views.ModelMachineLearningView)
router.register(r'IoTAnalyzerDevices', views.IoTAnalyzerDevicesView)
router.register(r'BlackListIP', views.BlackListIPView)
router.register(r'WhiteListIP',views.WhiteListIPView)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('IoTAnalyzerDevices/mail/<int:device_id>', views._retrieve_or_create_mail),
    path('IoTAnalyzerDevices/mail/edit', views._update_mail),
    path('IoTAnalyzerDevices/sms/<int:device_id>', views._retrieve_or_create_sms),
    path('IoTAnalyzerDevices/sms/edit', views._update_sms),
    path('IoTAnalyzerDevices/mail/send', views._send_mail),
    path('IoTAnalyzerDevices/sms/send', views._send_sms),
    path('IoTAnalyzerDevices/telegram/send', views._send_telegram),
    path('IoTAnalyzerDevices/devices/<int:analyzer_id>', views._get_device),
    path('IoTAnalyzerDevices/dashboard/stat/<int:analyzer_id>', views._get_dashboard_stat),
    path('IoTAnalyzerDevices/IpsTracking/stat_ips/<int:analyzer_id>', views._get_iptracking_stat_ips),
    path('IoTAnalyzerDevices/distribtutions/graph', views.DistribtionGraphView.as_view()),
    path('IoTAnalyzerDevices/distribtutions', views.DistribtutedView.as_view()),
    path('alerts/export', views.ExportPDF.as_view()),
    path('alerts/export/url', views.GetExportPDFURL.as_view()),
    path('alerts/export-xls', views.ExportXLS.as_view()),
    path('alerts/export-xls/url', views.GetExportXLSURL.as_view()),
    path('BlackListIP/clear', views.BlacklistClearView.as_view()),
    path('BlackListIP/all', views.BlacklistAllView.as_view()),
    path('WhiteListIP/clear', views.WhitelistClearView.as_view()),
    path('WhiteListIP/all', views.WhitelistAllView.as_view()),

]
