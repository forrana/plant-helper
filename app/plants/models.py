from django.db import models


class House(models.Model):
    house_name = models.CharField(max_length=200)

class Room(models.Model):
    room_name = models.CharField(max_length=200)
    room_description = models.CharField(max_length=200)
    house = models.ForeignKey(House, on_delete=models.CASCADE)

class Plant(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200)
    planted = models.DateTimeField('date planted')
    watered = models.DateTimeField('date watered')
    repoted = models.DateTimeField('date repoted')
    furtilized = models.DateTimeField('date furtilized')
