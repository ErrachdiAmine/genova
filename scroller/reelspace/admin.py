from django.contrib import admin
from .models import CustomUser, Feed, Reel
# Register your models here.


admin.site.register(CustomUser) # Register the User
admin.site.register(Feed) # Register the Feeds
admin.site.register(Reel) # Register the Reels