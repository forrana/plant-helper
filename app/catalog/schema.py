from graphene_django import DjangoObjectType
import graphene

from .models import PlantEntry

class PlantEntryType(DjangoObjectType):
    class Meta:
        model = PlantEntry
        fields = "__all__"

class Query(graphene.ObjectType):
    plant_entries = graphene.List(PlantEntryType)
    plant_entries_by_name_fragment = graphene.List(PlantEntryType, name_fragment=graphene.String(required=True))

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

schema = graphene.Schema(query=Query)
