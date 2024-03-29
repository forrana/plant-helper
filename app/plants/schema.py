from .utils import get_time_between_watering_field_for_current_season
from django.db.models.expressions import ExpressionWrapper, F
from django.db.models.fields import DateTimeField
from users.models import CustomUser
from graphene_django import DjangoObjectType
from graphene import relay, ObjectType
from graphql_relay.node.node import from_global_id
import graphene
import datetime
from graphql import GraphQLError
from django.utils import timezone
from graphene_django.filter import DjangoFilterConnectionField

from .models import Plant, Room, House, Symbol, WateredAtEntry

class PlantType(DjangoObjectType):
    days_until_next_watering = graphene.Int()
    days_between_watering = graphene.Int()
    days_between_watering_growing = graphene.Int()
    days_between_watering_dormant = graphene.Int()
    days_postpone = graphene.Int()
    class Meta:
        model = Plant
        filter_fields = {
            'scientific_name': ['exact', 'icontains', 'istartswith'],
            'name': ['exact', 'icontains', 'istartswith']
        }
        fields = "__all__"
        interfaces = (relay.Node, )

class RoomType(DjangoObjectType):
    class Meta:
        model = Room
        fields = "__all__"

class RoomSuggestionType(DjangoObjectType):
    class Meta:
        model = Room
        fields = "__all__"

class SymbolType(DjangoObjectType):
    class Meta:
        model = Symbol
        fields = ("id", "user_wide_id")

class OwnerType(DjangoObjectType):
    class Meta:
        model = CustomUser
        field = ("id", "name")

class HouseType(DjangoObjectType):
    class Meta:
        model = House
        fields = ("id", "house_name", "rooms")

class Query(graphene.ObjectType):
    plants = graphene.List(PlantType)
    filtered_plants = relay.Node.Field(PlantType)
    rooms  = graphene.List(RoomType)
    plants_by_room = graphene.Field(PlantType, room_id=graphene.Int(required=True))
    rooms_by_name_fragment = graphene.List(RoomSuggestionType, name_fragment=graphene.String(required=True))
    all_filtered_plants = DjangoFilterConnectionField(PlantType)

    def resolve_plants(self, info, **kwargs):
        return Plant.get_sorted_user_plants(user=info.context.user)


    def resolve_all_filtered_plants(self, info, **kwargs):
        return Plant.get_sorted_user_plants(user=info.context.user)

    def resolve_rooms(self, info, **kwargs):
        try:
            if not info.context.user.is_authenticated:
                raise GraphQLError('Unauthorized')
            else:
                return Room.objects.filter(owner=info.context.user)
        except Room.DoesNotExist:
            return None

    def resolve_rooms_by_name_fragment(self, info, name_fragment):
        try:
            if not info.context.user.is_authenticated:
                raise GraphQLError('Unauthorized')
            else:
                return Room.objects.filter(owner=info.context.user).filter(room_name__icontains=name_fragment)
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
        group_name = graphene.String()
        color_background = graphene.String()

    ok = graphene.Boolean()
    plant = graphene.Field(lambda: PlantType)

    @classmethod
    def mutate(root, id, info, plant_name, scientific_name, days_between_watering_growing, days_between_watering_dormant, group_name, color_background):
        owner = info.context.user
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.create(name=plant_name, scientific_name=scientific_name, owner=info.context.user,
                                     time_between_watering_growing = datetime.timedelta(days=days_between_watering_growing),
                                     time_between_watering_dormant = datetime.timedelta(days=days_between_watering_dormant)
                                     )
        if group_name:
            try:
                room = Room.objects.get(room_name=group_name, owner=owner)
                if room.color_background != color_background:
                    room.color_background = color_background
                    room.save()
            except Room.DoesNotExist:
                room = Room.objects.create(owner=owner, room_name=group_name, color_background=color_background)
            if plant.room != room:
                plant.room = room
                plant.save()

        ok = True
        return CreatePlant(plant=plant, ok=ok)

class WaterPlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, id, info, plant_id):
        pk = from_global_id(plant_id)[1]
        plant = Plant.get_user_plant_by_id(pk, info.context.user)
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
        pk = from_global_id(plant_id)[1]
        plant = Plant.get_user_plant_by_id(pk=pk, user=info.context.user)
        plant.postpone_days = (plant.postpone_days + datetime.timedelta(days=days))
        plant.save()
        ok = True
        return WaterPlant(plant=plant, ok=ok)

class UpdateRoom(graphene.Mutation):
    class Arguments:
        room_id   = graphene.ID()
        room_name = graphene.String()

    ok = graphene.Boolean()
    room = graphene.Field(RoomType)

    @classmethod
    def mutate(root, id, info, room_id, room_name):
        owner = info.context.user
        if not owner.is_authenticated:
            raise GraphQLError('Unauthorized')
        room = Room.objects.get(pk=room_id, owner=owner)
        if not room:
            raise GraphQLError('Room not found')
        room.room_name = room_name
        room.save()

        ok = True
        return UpdateRoom(room=room, ok=ok)


class UpdatePlant(graphene.Mutation):
    class Arguments:
        plant_id = graphene.ID()
        plant_name = graphene.String()
        scientific_name = graphene.String()
        days_between_watering_growing = graphene.Int()
        days_between_watering_dormant = graphene.Int()
        postpone_days = graphene.Int()
        group_name = graphene.String()
        color_background = graphene.String()
    ok = graphene.Boolean()
    plant = graphene.Field(PlantType)

    @classmethod
    def mutate(root, id, info, plant_id, plant_name, scientific_name,\
                days_between_watering_growing, days_between_watering_dormant, postpone_days, group_name,\
                color_background
            ):
        pk = from_global_id(plant_id)[1]
        owner = info.context.user
        if not owner.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.get(pk=pk, owner=owner)
        if not plant:
            raise GraphQLError('Plant not found')
        plant.name = plant_name
        plant.scientific_name = scientific_name
        plant.time_between_watering_growing = datetime.timedelta(days=days_between_watering_growing)
        plant.time_between_watering_dormant = datetime.timedelta(days=days_between_watering_dormant)
        plant.postpone_days = datetime.timedelta(days=postpone_days)
        if group_name:
            try:
                room = Room.objects.get(room_name=group_name, owner=owner)
                if room.color_background != color_background:
                    room.color_background = color_background
                    room.save()
            except Room.DoesNotExist:
                room = Room.objects.create(owner=owner, room_name=group_name, color_background=color_background)
            if plant.room != room:
                plant.room = room
        else:
            plant.room = None
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
        pk = from_global_id(plant_id)[1]
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        plant = Plant.objects.get(pk=pk, owner=info.context.user)
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
    update_room  = UpdateRoom.Field()
    postpone_watering = PostponeWatering.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
