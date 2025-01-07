from . import views
from django.urls import path, include
from django.views.generic import TemplateView

app_name = 'reelspace'

urlpatterns = [
    path('scroller/', TemplateView.as_view(template_name= 'reelspace/index.html'), name='index'),
    path('api/', include('reelspace_api.urls'), name='apiData')
]