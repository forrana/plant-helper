from django.contrib import admin

from .models import Plant, Room, House


admin.site.register(House)
admin.site.register(Room)
admin.site.register(Plant)
