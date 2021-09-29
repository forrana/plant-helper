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

    def save(self, *args, **kwargs):
        is_new = True if not self.pk else False
        super(PlantEntry, self).save(*args, **kwargs)
        if is_new:
            for nick_name in self.nick_names:
                print(nick_name)
                nick_name_entry = NickName(plant_entry=self, name=nick_name)
                nick_name_entry.save()


    @property
    def days_between_watering_growing_int(self):
        return self.days_between_watering_growing.days

    @property
    def days_between_watering_dormant_int(self):
        return self.days_between_watering_dormant.days

    class Meta:
        indexes = [models.Index(fields=['nick_name']), models.Index(fields=['scientific_name'])]

class NickName(models.Model):
    plant_entry = models.ForeignKey(PlantEntry, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.name}"


    class Meta:
        indexes = [models.Index(fields=['name'])]
