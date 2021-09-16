import datetime

from django.db import models
from django.conf import settings
from django.utils import timezone
from users.models import CustomUser

class House(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    house_name = models.CharField(max_length=200)
    def __str__(self):
        return self.house_name

class Room(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    room_name = models.CharField(max_length=200)
    room_description = models.CharField(max_length=200, blank=True, default='')
    house = models.ForeignKey(House, on_delete=models.SET_NULL, blank=True, null=True)
    def __str__(self):
        return f"{self.house.house_name}.{self.room_name}"


class Symbol(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    user_wide_id = models.IntegerField(default=1)
    class Meta:
        ordering = ["user_wide_id"]

class Plant(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, blank=True, null=True)
    symbol = models.OneToOneField(Symbol, on_delete=models.CASCADE, blank=False, null=True)
    name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    description = models.CharField(max_length=1024, blank=True, default='')
    time_between_watering = models.DurationField(default=datetime.timedelta(days=7))
    postpone_days = models.DurationField(default=datetime.timedelta(days=0))
    planted = models.DateTimeField(default=timezone.now)
    watered = models.DateTimeField(default=timezone.now)
    repoted = models.DateTimeField(default=timezone.now)
    furtilized = models.DateTimeField(default=timezone.now)

    @property
    def days_until_next_watering(self):
        return ((self.time_between_watering + self.watered - self.postpone_days) - timezone.now() + datetime.timedelta(days=1)).days

    @property
    def days_between_watering(self):
        return self.time_between_watering.days

    def save(self, *args, **kwargs):
        is_new = True if not self.pk else False
        super(Plant, self).save(*args, **kwargs)
        if is_new:
            symbol_id = 1
            last_symbol = Symbol.objects.filter(user=self.owner).last()
            if last_symbol:
                symbol_id = last_symbol.user_wide_id + 1
            symbol = Symbol(user=self.owner, user_wide_id=symbol_id)
            symbol.save()
            self.symbol = symbol
            self.save()

    def __str__(self):
        prefix = ""
        plant_name = f"{self.scientific_name}.{self.name}"
        if self.room:
            prefix += f"{self.room.room_name}"
            if self.room.house:
                prefix = f"{self.room.house.house_name}.{prefix}"
        if prefix:
            return f"{prefix}.{plant_name}"
        else:
            return plant_name

class WateredAtEntry(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    watered_date = models.DateTimeField(default=timezone.now)