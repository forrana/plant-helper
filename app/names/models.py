from django.db import models

class NamePart(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        indexes = [models.Index(fields=['name']), ]
