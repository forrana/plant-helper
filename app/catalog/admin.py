from django.contrib import admin

from .models import NickName, PlantEntry

admin.site.register(PlantEntry)
admin.site.register(NickName)
