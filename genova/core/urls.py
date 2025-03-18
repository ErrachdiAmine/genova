from . import views
from django.urls import path, include
from django.views.generic import TemplateView

app_name = 'core'

urlpatterns = [
    path('genova/', TemplateView.as_view(template_name='core/index.html'), name='index'),
    path('api/', include('api.urls'), name='apiData'),
]
