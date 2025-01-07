from django.urls import path
from .views import UserView, UserDetailView


urlpatterns = [
  path('users/', UserView.as_view(), name='users'),
  path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]