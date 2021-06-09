from django.db import models

class PlantEntry(models.Model):
    nick_name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.scientific_name}.{self.nick_name}"

    class Meta:
        indexes = [models.Index(fields=['nick_name']), ]
