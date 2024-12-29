from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import authentication, permissions, status
from rest_framework.permissions import IsAuthenticated
from reelspace.models import CustomUser, Feed, Reel
from .serializers import CustomUserSerializer, FeedSerializer, ReelSerializer

# Create your views here.

class User_By_Id(APIView):
    permission_classes = {}

    def get(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            serializer = CustomUserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"error": "User not found"})
        

class Users(APIView):

    def get(self, request, *args, **kwargs):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Feed_By_Id(APIView):
    def get(self, request, pk):
        try:
            feed = Feed.objects.get(pk=pk)
            serializer = FeedSerializer(feed)
            return Response(serializer.data)
        except Feed.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"error": "Feed not found"})


class Feeds(APIView):
    def get(self, request, *args, **kwargs):
        feeds = Feed.objects.all()
        serializer = FeedSerializer(feeds, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = FeedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


