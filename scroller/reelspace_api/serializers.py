from rest_framework import serializers
from reelspace.models import CustomUser, Feed, Reel

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'firstname', 'lastname', 'email', 'password')

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed
        fields = ('id', 'user', 'title', 'description', 'content')

class ReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reel
        fields = ('id', 'user', 'title', 'description', 'reel')
    