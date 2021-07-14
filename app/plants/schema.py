from graphene_django import DjangoObjectType
import graphene
from django.utils import timezone

from .models import Plant, Room, House

class PlantType(DjangoObjectType):
    days_until_next_watering = graphene.Int()
    days_between_watering = graphene.Int()
    class Meta:
        model = Plant
        fields = "__all__"

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
            if not info.context.user.is_authenticated:
                return Plant.objects.none()
            else:
                return Plant.objects \
                    .order_by("watered") \
                    .select_related("room") \
                    .filter(owner=info.context.user)
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
        except Plant.DoesNotExist:
            return None

class CreatePlant(graphene.Mutation):
    class Arguments:
        plant_name = graphene.String()
        scientific_name = graphene.String()

    ok = graphene.Boolean()
    plant = graphene.Field(lambda: PlantType)

    @classmethod
    def mutate(root, info, id, plant_name, scientific_name):
        if not info.context.user.is_authenticated:
            return CreatePlant(plant=null, ok=False)
        plant = Plant.objects.create(name=plant_name, scientific_name=scientific_name, owner=info.context.user)
        ok = True
        return CreatePlant(plant=plant, ok=ok)

class WaterPlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, info, id, plant_id):
        plant = Plant.objects.get(pk=plant_id)
        plant.watered = timezone.now()
        plant.save()
        ok = True
        return WaterPlant(plant=plant, ok=ok)

class UpdatePlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
        plant_name = graphene.String()
        scientific_name = graphene.String()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, info, id, plant_id, plant_name, scientific_name):
        plant = Plant.objects.get(pk=plant_id)
        plant.name = plant_name
        plant.scientific_name = scientific_name
        plant.save()
        ok = True
        return UpdatePlant(plant=plant, ok=ok)

class DeletePlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, info, id, plant_id):
        plant = Plant.objects.get(pk=plant_id)
        plant.delete()
        ok = True
        return DeletePlant(plant=plant, ok=ok)

class Mutation(graphene.AbstractType, graphene.ObjectType):
    create_plant = CreatePlant.Field()
    water_plant  = WaterPlant.Field()
    update_plant = UpdatePlant.Field()
    delete_plant = DeletePlant.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
