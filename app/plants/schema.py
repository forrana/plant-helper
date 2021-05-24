from graphene_django import DjangoObjectType
import graphene

from .models import Plant, Room, House

class PlantType(DjangoObjectType):
    class Meta:
        model = Plant
        fields = ("id", "name", "scientific_name", "description", "room",
            "days_until_next_watering", "time_between_watering",
            "planted", "watered", "repoted", "furtilized")

class RoomType(DjangoObjectType):
    class Meta:
        model = Room
        fields = ("id", "room_name", "house", "plants")

class HouseType(DjangoObjectType):
    class Meta:
        model = House
        fields = ("id", "house_name", "rooms")

class Query(graphene.ObjectType):
    plants = graphene.List(PlantType)
    rooms  = graphene.List(RoomType)
    plants_by_room = graphene.Field(PlantType, room_id=graphene.Int(required=True))

    def resolve_plants(self, info, **kwargs):
        try:
            return Plant.objects.select_related("room").all()
        except Plant.DoesNotExist:
            return None

    def resolve_rooms(self, info, **kwargs):
        try:
            return Room.objects.select_related("house").all()
        except Room.DoesNotExist:
            return None

    def resolve_plants_by_room(root, info, room_id):
        try:
            return Plant.objects.select_related("room").get(room_id = room_id)
        except Room.DoesNotExist:
            return None

class Mutation(graphene.AbstractType, graphene.ObjectType):
    create_plant = PlantType()


schema = graphene.Schema(query=Query, mutation=Mutation)
