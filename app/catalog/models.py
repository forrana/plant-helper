from django.db import models
from django.contrib.postgres.fields import ArrayField
import datetime
from django.conf import settings
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, ResizeToFit

class PlantEntry(models.Model):
    nick_name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    nick_names = ArrayField(models.CharField(max_length=200, blank=True), null=True)
    days_between_watering_growing = models.DurationField(default=datetime.timedelta(days=5))
    days_between_watering_dormant = models.DurationField(default=datetime.timedelta(days=10))
    image_name = models.CharField(max_length=256, blank=True, null=True)
    
    # Generate different sizes automatically
    image_thumbnail = ImageSpecField(
        source='image_name',
        processors=[ResizeToFit(300, 300)],  # width, height
        format='JPEG',
        options={'quality': 80}
    )
    
    image_medium = ImageSpecField(
        source='image_name',
        processors=[ResizeToFit(800, 800)],
        format='JPEG',
        options={'quality': 85}
    )
    
    image_large = ImageSpecField(
        source='image_name',
        processors=[ResizeToFit(1200, 1200)],
        format='JPEG',
        options={'quality': 90}
    )

    def __str__(self):
        return f"{self.scientific_name}.{self.nick_name}"

    def get_image_url(self, size='medium'):
        """
        Returns the complete URL path for the image
        size options: 'thumbnail', 'medium', 'large', 'original'
        """
        if not self.image_name:
            return None
            
        if size == 'thumbnail':
            return self.image_thumbnail.url
        elif size == 'medium':
            return self.image_medium.url
        elif size == 'large':
            return self.image_large.url
        else:  # original
            return f'{settings.STATIC_URL}images/{self.image_name}'

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
