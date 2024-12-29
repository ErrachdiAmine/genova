from django.test import TestCase
from .models import *

# Create your tests here.

#Models testing

class UserTest(TestCase):

    def setUp(cls):
        test_user = User.objects.create(firstname = 'user_name', lastname = 'user_last_name', preferredNIckname = 'user_preferred_name', age = any)
        test_feed = Feed.objects.create(title = 'test_feed', description = 'test_feed_description', user = test_user)