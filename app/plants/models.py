import datetime

from django.db import models
from django.utils import timezone

class House(models.Model):
    house_name = models.CharField(max_length=200)
    def __str__(self):
        return self.house_name

class Room(models.Model):
    room_name = models.CharField(max_length=200)
    room_description = models.CharField(max_length=200, blank=True, default='')
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.house.house_name}.{self.room_name}"

class Plant(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    description = models.CharField(max_length=1024, blank=True, default='')
    time_between_watering = models.DurationField(default=datetime.timedelta(days=7))
    planted = models.DateTimeField(default=timezone.now())
    watered = models.DateTimeField(default=timezone.now())
    repoted = models.DateTimeField(default=timezone.now())
    furtilized = models.DateTimeField(default=timezone.now())

    def get_days_until_next_watering(self):
        return timezone.now() - (self.watered + self.time_between_watering)

    def __str__(self):
        return f"{self.room.house.house_name}.{self.room.room_name}.{self.name}"
