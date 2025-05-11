from django.contrib import admin
from .models import User, Post, Profile, Comment


admin.site.register(User)
admin.site.register(Post)
admin.site.register(Profile)
admin.site.register(Comment)

# Register your models here.
   