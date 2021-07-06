import graphene
import catalog.schema
import plants.schema
import names.schema
import users.schema

from graphql_auth.schema import UserQuery, MeQuery


class Query(
    catalog.schema.Query,
    plants.schema.Query,
    names.schema.Query,
    users.schema.Query,
    graphene.ObjectType
    ):
    pass

class Mutation(
        plants.schema.Mutation,
        users.schema.Mutation,
        graphene.AbstractType,
        graphene.ObjectType
    ):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
