from django.db import models
from django.contrib.auth.models import User
# Create your models here.

contentOptions = (
    ('text', 'text'),
    ('image', 'image'),
    ('video', 'video')
)

class CustomUser(models.Model):
    firstname = models.CharField(max_length=25, unique=False)
    lastname = models.CharField(max_length=25, unique=False)
    email = models.EmailField(max_length=100, unique=True, null=True)
    password = models.CharField(max_length=100, unique=False, null=True)
    signed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'User Information: {self.firstname} {self.lastname}'


class Feed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=2200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    content = models.CharField(choices=contentOptions, default='video', max_length=255)

    class Meta:
        ordering = ['-created_at']


class Reel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=2200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reel = models.FileField()

    class Meta:
        ordering = ['-created_at']