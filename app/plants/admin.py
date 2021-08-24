from django.contrib import admin

from .models import Plant, Room, House, Symbol


admin.site.register(House)
admin.site.register(Room)
admin.site.register(Plant)
admin.site.register(Symbol)
