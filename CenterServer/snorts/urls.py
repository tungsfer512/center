from django.urls import path
from .views import CreateRulesViews, GetImage
 
urlpatterns = [ 
    path('snorts', CreateRulesViews.as_view()),
    path('snorts/images', GetImage.as_view()),
]