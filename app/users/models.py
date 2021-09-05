from django.db import models

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(blank=False, max_length=254, verbose_name="email address")
    USERNAME_FIELD = "username"   # e.g: "username", "email"
    EMAIL_FIELD = "email"         # e.g: "email", "primary_email"


class PushSubscription(models.Model):
    endpoint = models.URLField(max_length=2000, blank=True)
    p256dh = models.CharField(max_length=200, blank=True)
    auth   = models.CharField(max_length=200, blank=True)
    permission_given = models.BooleanField(blank=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, blank=False)
