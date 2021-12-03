import datetime
from django.db import models
from django.utils import timezone

from django.contrib.auth.models import AbstractUser

import pytz

TIMEZONES = tuple(zip(pytz.all_timezones, pytz.all_timezones))

class CustomUser(AbstractUser):
    email = models.EmailField(blank=False, max_length=254, verbose_name="email address")
    USERNAME_FIELD = "username"   # e.g: "username", "email"
    EMAIL_FIELD = "email"         # e.g: "email", "primary_email"

class UserSettings(models.Model):
    notifications_start_time = models.TimeField(auto_now=False, auto_now_add=False, default=datetime.time(8, 0))
    notifications_end_time   = models.TimeField(auto_now=False, auto_now_add=False, default=datetime.time(20, 0))
    timezone = models.CharField(max_length=32, choices=TIMEZONES, default='UTC')
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, blank=False)

class PushSubscription(models.Model):
    endpoint = models.URLField(max_length=2000, blank=True)
    p256dh = models.CharField(max_length=200, blank=True)
    auth   = models.CharField(max_length=200, blank=True)
    permission_given = models.BooleanField(blank=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, blank=False)