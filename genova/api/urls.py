from django.urls import path
from .views import UserView, UserDetailsView, PostsView, check_login_status




urlpatterns = [
  path('users/', UserView.as_view(), name='users'),
  path('users/<int:pk>/', UserView.as_view(), name='user-detail'),
  path('posts/', PostsView.as_view(), name='posts'),
  path('posts/<int:pk>/', PostsView.as_view(), name='post-detail'),
  path('check_login_status/', check_login_status, name='check_login_status'),
  
]
