from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.models import User, Post
from .serializers import UserSerializer, PostSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import permissions


class IsAuthenticatedForWriteMethods(permissions.BasePermission):
    """
    Custom permission to only allow authenticated users for methods other than GET.
    """

    def has_permission(self, request, view):
        # Allow GET method for all users (authenticated or not)
        if request.method == 'GET':
            return True
        
        # Only allow POST, PUT, DELETE methods if the user is authenticated
        return request.user and request.user.is_authenticated


@api_view(['GET'])
def check_login_status(request):
    if request.user.is_authenticated:
        return Response({'is_logged_in': True, 'username': request.user.username})
    return Response({'is_logged_in': False})


class UserView(APIView):
    permission_classes = [IsAuthenticatedForWriteMethods]  # Allow any user to access this view

    def get(self, request):  # Ensure authorization is checked
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class PostsView(APIView):
    permission_classes = [IsAuthenticatedForWriteMethods]  # Require authentication for this view
    authentication_classes = [JWTAuthentication]  # Add TokenAuthentication for authorization

    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)  # Associate post with authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)