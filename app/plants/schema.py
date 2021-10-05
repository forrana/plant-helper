from .utils import get_time_between_watering_field_for_current_season
from django.db.models.expressions import ExpressionWrapper, F
from django.db.models.fields import DateTimeField
from graphene_django import DjangoObjectType
import graphene
import datetime
from graphql import GraphQLError
from django.utils import timezone

from .models import Plant, Room, House, Symbol, WateredAtEntry

class PlantType(DjangoObjectType):
    days_until_next_watering = graphene.Int()
    days_between_watering = graphene.Int()
    days_between_watering_growing = graphene.Int()
    days_between_watering_dormant = graphene.Int()
    days_postpone = graphene.Int()
    class Meta:
        model = Plant
        fields = "__all__"

class RoomType(DjangoObjectType):
    class Meta:
        model = Room
        fields = ("id", "room_name", "house", "plants")

class SymbolType(DjangoObjectType):
    class Meta:
        model = Symbol
        fields = ("id", "user_wide_id")

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
                raise GraphQLError('Unauthorized')
            else:
                return Plant.objects \
                    .annotate(when_to_water=ExpressionWrapper( \
                        (F('watered') + F(get_time_between_watering_field_for_current_season(timezone.now())) + F('postpone_days')), output_field=DateTimeField())) \
                    .order_by("when_to_water") \
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

class CreateRoom(graphene.Mutation):
    class Arguments:
        plant_1_id = graphene.ID()
        plant_2_id = graphene.ID()

    ok = graphene.Boolean()
    room = graphene.Field(lambda: RoomType)

    @classmethod
    def mutate(root, id, info, plant_1_id, plant_2_id):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        room = Room.objects.create(room_name="New room")
        plant_1 = Plant.objects.get(pk=plant_1_id, owner=info.context.user)
        plant_2 = Plant.objects.get(pk=plant_2_id, owner=info.context.user)
        if not plant_1 or not plant_2:
            raise GraphQLError('Unauthorized')
        plant_1.room = room
        plant_2.room = room
        plant_1.save()
        plant_2.save()

class CreatePlant(graphene.Mutation):
    class Arguments:
        plant_name = graphene.String()
        scientific_name = graphene.String()
        days_between_watering_growing = graphene.Int()
        days_between_watering_dormant = graphene.Int()

    ok = graphene.Boolean()
    plant = graphene.Field(lambda: PlantType)

    @classmethod
    def mutate(root, id, info, plant_name, scientific_name, days_between_watering_growing, days_between_watering_dormant):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.create(name=plant_name, scientific_name=scientific_name, owner=info.context.user,
                                     time_between_watering_growing = datetime.timedelta(days=days_between_watering_growing),
                                     time_between_watering_dormant = datetime.timedelta(days=days_between_watering_dormant)
                                     )
        ok = True
        return CreatePlant(plant=plant, ok=ok)

class WaterPlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, id, info, plant_id):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.get(pk=plant_id, owner=info.context.user)
        if not plant:
            raise GraphQLError('Unauthorized')
        plant.watered = timezone.now()
        watered_at_entry = WateredAtEntry(plant=plant, watered_date=plant.watered)
        watered_at_entry.save()
        plant.postpone_days = datetime.timedelta(days=0)
        plant.save()
        ok = True
        return WaterPlant(plant=plant, ok=ok)

class PostponeWatering(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
        days     = graphene.Int()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, id, info, plant_id, days):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.get(pk=plant_id, owner=info.context.user)
        if not plant:
            raise GraphQLError('Unauthorized')
        plant.postpone_days = (plant.postpone_days + datetime.timedelta(days=days))
        plant.save()
        ok = True
        return WaterPlant(plant=plant, ok=ok)

class UpdatePlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
        plant_name = graphene.String()
        scientific_name = graphene.String()
        days_between_watering_growing = graphene.Int()
        days_between_watering_dormant = graphene.Int()
        postpone_days = graphene.Int()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, id, info, plant_id, plant_name, scientific_name, days_between_watering_growing, days_between_watering_dormant, postpone_days):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.get(pk=plant_id, owner=info.context.user)
        if not plant:
            raise GraphQLError('Unauthorized')
        plant.name = plant_name
        plant.scientific_name = scientific_name
        plant.time_between_watering_growing = datetime.timedelta(days=days_between_watering_growing)
        plant.time_between_watering_dormant = datetime.timedelta(days=days_between_watering_dormant)
        plant.postpone_days = datetime.timedelta(days=postpone_days)
        plant.save()
        ok = True
        return UpdatePlant(plant=plant, ok=ok)

class DeletePlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, id, info, plant_id):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.get(pk=plant_id, owner=info.context.user)
        if not plant:
            raise GraphQLError('Unauthorized')
        plant.symbol.delete()
        plant.delete()
        ok = True
        return DeletePlant(plant=plant, ok=ok)

class Mutation(graphene.AbstractType, graphene.ObjectType):
    create_plant = CreatePlant.Field()
    water_plant  = WaterPlant.Field()
    update_plant = UpdatePlant.Field()
    delete_plant = DeletePlant.Field()
    postpone_watering = PostponeWatering.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
