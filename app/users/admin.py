from django.contrib import admin

from .models import PushSubscription, SharedWith

# Register your models here.
admin.site.register(PushSubscription)
admin.site.register(SharedWith)