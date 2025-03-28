from django.urls import path
from .views import UserView, UserDetailView, PostsView, PostDetailView, check_login_status, Myposts, ProfileView


app_name = 'api'

urlpatterns = [
  path('users/', UserView.as_view(), name='users'),
  path('users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
  path('users/<int:pk>/profile/', ProfileView.as_view(), name='profile'),
  path('posts/', PostsView.as_view(), name='posts'),
  path('posts/my-posts/', Myposts.as_view(), name='my-posts'),
  path('posts/my-posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
  path('check-login-status/', check_login_status, name='check-login-status'),
]
