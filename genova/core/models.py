from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from cloudinary.models import CloudinaryField
from django.db.models.signals import post_save
from django.dispatch import receiver

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

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(max_length=500, blank=True)
    profile_image = CloudinaryField(
        'image',
        default='https://res.cloudinary.com/dwsmidse8/image/upload/v1746387500/defaultAvatar_lnamq0.jpg',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} Profile"
    
class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT  # Automatically delete posts when the user is deleted
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Comment(models.Model):
    post = models.ForeignKey( 
        Post,
        related_name='comments',
        on_delete=models.CASCADE,
        null=True,
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='comments',
        on_delete=models.CASCADE
    )
    body = models.TextField()
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='liked_comments',
        blank=True
    )

    class Meta:
        ordering = ['created_at']

    @property
    def children_count(self):
        # Number of direct replies
        return self.children.count()

    @property
    def likes_count(self):
        return self.likes.count()

    def is_liked_by(self, user):
        # Whether the given user has liked this comment
        return self.likes.filter(pk=user.pk).exists()

    def can_edit(self, user):
        # Simple rule: only the author may edit
        return user.is_authenticated and user == self.author

    def can_delete(self, user):
        # Example: authors or staff can delete
        return user.is_authenticated and (user == self.author or user.is_staff)

    def can_reply(self, user):
        # Everyone who’s authenticated can reply
        return user.is_authenticated

