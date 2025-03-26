from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from core.models import User, Post
from .serializers import UserSerializer, UserDetailSerializer, PostSerializer, ProfileSerializer
from rest_framework.parsers import MultiPartParser, JSONParser



class UserAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'POST']:
            return True  # Allow GET and POST for all
        return request.user and request.user.is_authenticated  # Require auth for PUT/DELETE

class IsPostAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

def check_login_status(request):
    """Endpoint to check if the user is logged in (works consistently across views)."""
    return Response({
        'id': request.user.id if request.user.is_authenticated else None,
        'is_logged_in': request.user.is_authenticated,
        'username': request.user.username if request.user.is_authenticated else None,
        'email': request.user.email if request.user.is_authenticated else None,
        'firstname': request.user.first_name if request.user.is_authenticated else None,
        'lastname': request.user.last_name if request.user.is_authenticated else None,
        'date_joined': request.user.date_joined if request.user.is_authenticated else None,
        'is_staff': request.user.is_staff,
        'is_active': request.user.is_active

    })

class UserView(APIView):
    authentication_classes = [JWTAuthentication]  # Always process JWT
    permission_classes = [UserAccessPermission]   # Custom permission for User access

    # --- GET: List all users (open to all) ---
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    # --- POST: Create a new user (open to all, e.g., registration) ---
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # --- PUT: Update user (requires auth) ---
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

    # --- DELETE: Delete user (requires auth) ---
    def delete(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

# user detail view


class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'user_id'
        
    
class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, JSONParser]  # For file uploads

    def get_user_or_404(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    # GET: Retrieve profile (public or private)
    def get(self, request, pk=None):
        try:
            if pk:
                user = self.get_user_or_404(pk)
                if not user:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                user = request.user

            serializer = ProfileSerializer(user)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT: Full profile update (needs permission check)
    def put(self, request, pk=None):
        try:
            # Determine target user
            if pk:
                user = self.get_user_or_404(pk)
                if not user:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
                
                # Authorization check
                if not (request.user.is_staff or request.user == user):
                    return Response({'error': 'Unauthorized update'}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = request.user

            serializer = ProfileSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PATCH: Partial profile update
    def patch(self, request, pk=None):
        try:
            if pk:
                user = self.get_user_or_404(pk)
                if not user:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
                
                if not (request.user.is_staff or request.user == user):
                    return Response({'error': 'Unauthorized update'}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = request.user

            serializer = ProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE: Deactivate profile (soft delete example)
    def delete(self, request, pk=None):
        try:
            if pk and not request.user.is_staff:
                return Response({'error': 'Admin required'}, status=status.HTTP_403_FORBIDDEN)
            
            user = request.user if not pk else self.get_user_or_404(pk)
            if not user:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # Soft delete example
            user.is_active = False
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class PostsView(APIView):
    authentication_classes = [JWTAuthentication]  # Always process JWT
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPostAuthor]  # GET=open, others=auth

    # --- GET: List all posts (open to all) ---
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)    
    
    def post(self, request):
        serializer = PostSerializer(
            data=request.data,
            context={'request': request}  # Required for CurrentUserDefault
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # --- List All Posts (Shows author details) ---
    

    # --- PUT: Update post (requires auth) ---
    def put(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(
                post,
                data=request.data,
                context={'request': request}  # for CurrentUserDefault    
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    # --- DELETE: Delete post (requires auth) ---
    def delete(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        

class PostDetailView (APIView):
    authentication_classes = [JWTAuthentication]  # Always process JWT
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsPostAuthor]  # GET=open, others

    def get(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        

class Myposts(APIView) : 
    authentication_classes = [JWTAuthentication]  # Always process JWT
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access

    def get(self, request):
        posts = Post.objects.filter(author=request.user)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PostSerializer( data=request.data, context={'request': request} )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put (self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(
                post,
                data=request.data,
                context={'request': request}  # for CurrentUserDefault
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
    
    def delete(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
