from .models import PushSubscription
from graphene_django import DjangoObjectType
from graphql import GraphQLError
import graphene

from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    update_account = mutations.UpdateAccount.Field()
    send_secondary_email_activation = mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()

class SubscriptionType(DjangoObjectType):
    class Meta:
        model = PushSubscription
        fields = "__all__"

class CreateSubscription(graphene.Mutation):
    class Arguments:
        endpoint = graphene.String()
        p256dh = graphene.String()
        auth   = graphene.String()
        permission_given = graphene.Boolean()

    ok = graphene.Boolean()
    subscription = graphene.Field(lambda: SubscriptionType)

    @classmethod
    def mutate(root, id, info, endpoint, p256dh, auth, permission_given):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        subscription = PushSubscription.objects.create(endpoint=endpoint, p256dh=p256dh, auth=auth, permission_given=permission_given, user=info.context.user)
        ok = True
        return CreateSubscription(subscription=subscription, ok=ok)


class SubscriptionQuery(graphene.ObjectType):
    subscription = graphene.Field(SubscriptionType)

    def resolve_subscription(self, info):
        user = info.context.user
        if user.is_authenticated:
            PushSubscription.objects.get(user = user)
        raise GraphQLError('Unauthorized')


class Query(UserQuery, MeQuery, SubscriptionQuery, graphene.ObjectType):
    pass

class Mutation(AuthMutation, graphene.ObjectType):
   create_subscription = CreateSubscription.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
