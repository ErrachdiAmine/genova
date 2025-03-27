from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


#create abstract user

class User(AbstractUser):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  
    version = models.IntegerField(default=1)  # Add version field for optimistic locking
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='core_user_set',  # custom reverse accessor for groups
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='core_user_permissions_set',  # custom reverse accessor for permissions
        blank=True
    )

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    profile_image = models.ImageField(upload_to='profile_pics/', default= 'ProfileDefaultAvatar.jpg')

    def __str__(self):
        return f"{ self.user.username } Profile"
    
class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
