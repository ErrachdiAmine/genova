from rest_framework import serializers
from core.models import *



#serialize the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    #check and validate the email ad username
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
        
    #hash the password before saving
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
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

class PostSerializer(serializers.ModelSerializer):

    author = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    class Meta:
        model = Post
        fields = ('id', 'title', 'body', 'author', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'author')
    
    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.body = validated_data.get('body', instance.body)
        instance.save()
        return instance
