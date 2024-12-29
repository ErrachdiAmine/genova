from django.urls import path, include
from . import views
from .views import User_By_Id, Users, Feed_By_Id,Feeds


urlpatterns = [
    path('users/<int:pk>/', User_By_Id.as_view(), name='AllUsersApiList'),
    path('users/', Users.as_view(), name='AllUsersApiList'),
    path('feeds/<int:pk>/', Feed_By_Id.as_view(), name='FeedsApiList'),
    path('feeds/', Feeds.as_view(), name='FeedsApiList')

]