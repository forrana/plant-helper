from graphene_django import DjangoObjectType
import graphene

from .models import NamePart

class NamePartType(DjangoObjectType):
    class Meta:
        model = NamePart
        fields = "__all__"

class Query(graphene.ObjectType):
    name_parts = graphene.List(NamePartType)

    def resolve_plant_entries(self, info):
        try:
            return NamePart.objects.all()
        except NamePart.DoesNotExist:
            return None

schema = graphene.Schema(query=Query)
