from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


#create abstract user

class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    USERNAME_FIELD = 'last_name'
    REQUIRED_FIELDS = ['first_name', 'last_name']
   

    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='reelspace_user_set',  # custom reverse accessor for groups
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='reelspace_user_permissions_set',  # custom reverse accessor for permissions
        blank=True
    )






