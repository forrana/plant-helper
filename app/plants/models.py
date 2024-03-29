from .utils import is_growing_season
from datetime import timedelta

from django.db import models
from django.conf import settings
from django.utils import timezone
from users.models import CustomUser, SharedWith
from .utils import get_time_between_watering_field_for_current_season
from django.db.models.expressions import ExpressionWrapper, F
from django.db.models.fields import DateTimeField
from graphql import GraphQLError


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
    color_background = models.CharField(max_length=9, default="#000000")
    color_text = models.CharField(max_length=9, default="#FFFFFF")
    def __str__(self):
        if self.house:
            return f"{self.house.house_name}.{self.room_name}"
        else:
            return f"{self.room_name}"


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
    time_between_watering_growing = models.DurationField(default=timedelta(days=7))
    time_between_watering_dormant = models.DurationField(default=timedelta(days=10))
    postpone_days = models.DurationField(default=timedelta(days=0))
    planted = models.DateTimeField(default=timezone.now)
    watered = models.DateTimeField(default=timezone.now)
    repoted = models.DateTimeField(default=timezone.now)
    furtilized = models.DateTimeField(default=timezone.now)

    @property
    def time_between_watering(self):
        if is_growing_season(timezone.now()):
            return self.time_between_watering_growing
        else:
            return self.time_between_watering_dormant

    @property
    def days_until_next_watering(self):
        return ((self.time_between_watering + self.watered.replace(hour=0, minute=0, second=0, microsecond=0) + self.postpone_days) - timezone.now() + timedelta(days=1)).days

    @property
    def days_between_watering(self):
        return self.time_between_watering.days

    @property
    def days_between_watering_growing(self):
        return self.time_between_watering_growing.days

    @property
    def days_between_watering_dormant(self):
        return self.time_between_watering_dormant.days

    @property
    def days_postpone(self):
        return self.postpone_days.days

    @staticmethod
    def get_sorted_user_plants(user):
        if not user.is_authenticated:
            raise GraphQLError('Unauthorized')
        else:
            try:
                all_owners = list(user.borrowers) + [user.pk]
                print(all_owners)
                return Plant.objects \
                            .filter(owner__pk__in=all_owners) \
                            .annotate(when_to_water=ExpressionWrapper( \
                                (F('watered') + F(get_time_between_watering_field_for_current_season(timezone.now())) + F('postpone_days')), output_field=DateTimeField())) \
                            .order_by("when_to_water") \
                            .select_related("room")
            except Plant.DoesNotExist:
                return None

    @staticmethod
    def get_user_plant_by_id(pk, user):
        if not user.is_authenticated:
            raise GraphQLError('Unauthorized')
        try:
            all_owners = list(user.borrowers) + [user.pk]
            return Plant.objects.get(pk=pk, owner__pk__in=all_owners)
        except Plant.DoesNotExist:
            raise GraphQLError('Unauthorized')


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