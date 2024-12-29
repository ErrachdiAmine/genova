from . import views
from django.urls import path
from django.views.generic import TemplateView

app_name = 'reelspace'

urlpatterns = [
    path('scroller/', TemplateView.as_view(template_name= 'reelspace/index.html'), name='index'),
]