from rest_framework import serializers
from core.models import *

class UserSerializer(serializers.ModelSerializer):
    version = serializers.IntegerField(required=False)  # Add version field for optimistic locking
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    # Validate email and username
    def validate_email(self, value):
        instance = self.instance
        if instance and instance.email == value:
            return value  # No change, skip validation
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_username(self, value):
        instance = self.instance
        if instance and instance.username == value:
            return value  # No change, skip validation
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
        
    # Hash the password before saving
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        # Check for version conflict
        if 'version' in validated_data and validated_data['version'] != instance.version:
            raise serializers.ValidationError("Version conflict. The object has been modified by another process.")
        # Update other fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        
        # Update password only if provided
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UserDetailSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail',
        lookup_field='id',
        lookup_url_kwarg='user_id'
    )
    
    posts = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='post-detail',
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            'url',
            'id', 
            'username',
            'email',
            'first_name',
            'last_name',
            'date_joined',
            'posts'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

# serializers.py

class ProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(
        required=False,
        allow_null=True,
        max_length=None  # For long filenames
    )
    
    class Meta:
        model = Profile
        fields = [
            'bio', 'profile_image', 'email', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']


class PostSerializer(serializers.ModelSerializer):
    # Auto-set author to the authenticated user (write-only)
    author = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    
    # Display author details when reading (no DB changes needed)
    author_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'title', 'body', 'author', 'author_details', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'author', 'author_details')

    def get_author_details(self, obj):
        """Serialize author data for GET requests."""
        return {
            'id': obj.author.id,
            'username': obj.author.username,
            'email': obj.author.email
        }
    
class PostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'body', 'author', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'author')
