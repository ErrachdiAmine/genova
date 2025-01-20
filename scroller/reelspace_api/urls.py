from django.urls import path
from .views import UserView, UserDetailsView



urlpatterns = [
  path('users/', UserView.as_view(), name='users'),
  path('users/<int:pk>/', UserDetailsView.as_view(), name='user-detail'),
  
]