from graphene.types import field
from graphene_django import DjangoObjectType
import graphene

from .models import PlantEntry, NickName

class PlantEntryType(DjangoObjectType):
    days_between_watering_growing_int = graphene.Int()
    days_between_watering_dormant_int = graphene.Int()
    class Meta:
        model = PlantEntry
        fields = "__all__"

class NickNameType(DjangoObjectType):
    class Meta:
        model = NickName
        fields = "__all__"

class Query(graphene.ObjectType):
    plant_entries = graphene.List(PlantEntryType)
    plant_entries_by_name_fragment = graphene.List(PlantEntryType, name_fragment=graphene.String(required=True))
    nick_name_entries_by_name_fragment = graphene.List(NickNameType, name_fragment=graphene.String(required=True))

    def resolve_plant_entries(self, info):
        try:
            return PlantEntry.objects.all()
        except PlantEntry.DoesNotExist:
            return None

    def resolve_plant_entries_by_name_fragment(self, info, name_fragment):
        try:
            return PlantEntry.objects.filter(nick_name__contains=name_fragment)
        except PlantEntry.DoesNotExist:
            return None

    def resolve_nick_name_entries_by_name_fragment(self, info, name_fragment):
        try:
            return NickName.objects.filter(name__icontains=name_fragment).select_related("plant_entry")
        except NickName.DoesNotExist:
            return None

schema = graphene.Schema(query=Query)
