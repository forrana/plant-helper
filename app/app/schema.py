import graphene
import catalog.schema
import plants.schema
import names.schema

from graphene_django.debug import DjangoDebug

class Query(
    catalog.schema.Query,
    plants.schema.Query,
    names.schema.Query,
    graphene.ObjectType
    ):
    debug = graphene.Field(DjangoDebug, name="_debug")

class Mutation(
        plants.schema.Mutation,
        graphene.AbstractType,
        graphene.ObjectType
    ):
    debug = graphene.Field(DjangoDebug, name="_debug")


schema = graphene.Schema(query=Query, mutation=Mutation)
