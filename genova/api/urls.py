from django.urls import path
from .views import UserView, PostsView, check_login_status, Myposts, ProfileUpdate


app_name = 'api'

urlpatterns = [
  path('users/', UserView.as_view(), name='users'),
  path('users/<int:pk>/', UserView.as_view(), name='user-detail'),
  path('users/<int:pk>/profile', ProfileUpdate.as_view(), name='profile'),
  path('posts/', PostsView.as_view(), name='posts'),
  path('posts/<int:pk>/', PostsView.as_view(), name='post-detail'),
  path('posts/my-posts/', Myposts.as_view(), name='my-posts'),
  path('check_login_status/', check_login_status, name='check_login_status'),
]
