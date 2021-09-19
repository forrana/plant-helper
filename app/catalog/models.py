from django.db import models
from django.contrib.postgres.fields import ArrayField
import datetime

class PlantEntry(models.Model):
    nick_name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    nick_names = ArrayField(models.CharField(max_length=200, blank=True), null=True)
    days_between_watering_growing = models.DurationField(default=datetime.timedelta(days=5))
    days_between_watering_dormant = models.DurationField(default=datetime.timedelta(days=10))


    def __str__(self):
        return f"{self.scientific_name}.{self.nick_name}"

    class Meta:
        indexes = [models.Index(fields=['nick_name']), models.Index(fields=['scientific_name'])]
