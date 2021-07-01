import datetime

from django.db import models
from django.conf import settings
from django.utils import timezone

class House(models.Model):
    house_name = models.CharField(max_length=200)
    def __str__(self):
        return self.house_name

class Room(models.Model):
    room_name = models.CharField(max_length=200)
    room_description = models.CharField(max_length=200, blank=True, default='')
    house = models.ForeignKey(House, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return f"{self.house.house_name}.{self.room_name}"

class Plant(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    description = models.CharField(max_length=1024, blank=True, default='')
    time_between_watering = models.DurationField(default=datetime.timedelta(days=7))
    planted = models.DateTimeField(default=timezone.now)
    watered = models.DateTimeField(default=timezone.now)
    repoted = models.DateTimeField(default=timezone.now)
    furtilized = models.DateTimeField(default=timezone.now)

    @property
    def days_until_next_watering(self):
        return ((self.time_between_watering + self.watered) - timezone.now() + datetime.timedelta(days=1)).days

    @property
    def days_between_watering(self):
        return self.time_between_watering.days

    def __str__(self):
        prefix:string = ""
        plant_name = f"{self.scientific_name}.{self.name}"
        if self.room:
            prefix += f"{self.room.room_name}"
            if self.room.house:
                prefix = f"{self.room.house.house_name}.{prefix}"
        if prefix:
            return f"{prefix}.{plant_name}"
        else:
            return plant_name
