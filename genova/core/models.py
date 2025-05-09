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

    
class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField()
    
    def __str__(self):
        return self.title
