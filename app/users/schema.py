import datetime
import re
from django.db.models import fields
from graphene.types import field
from .models import CustomUser, PushSubscription, SharedWith, UserSettings
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

class UserSettingsType(DjangoObjectType):
    timezone = graphene.String()
    class Meta:
        model = UserSettings
        fields = "__all__"

    def resolve_timezone(settings, info):
        return settings.timezone


class SharedWithType(DjangoObjectType):
    class Meta:
        model = SharedWith
        fields = "__all__"


class UpsertUserSettings(graphene.Mutation):
    class Arguments:
        start_time = graphene.String()
        end_time = graphene.String()
        timezone = graphene.String()
        interval = graphene.Int()

    ok = graphene.Boolean()
    userSettings = graphene.Field(lambda: UserSettingsType)

    @classmethod
    def mutate(root, id, info, start_time, end_time, interval, timezone):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('Unauthorized')

        if not start_time or not end_time or not timezone or not interval:
            raise GraphQLError('Malformed request, all subscription fields are mandatory')

        try:
            settings = UserSettings.objects.get(user = user)
            start_time_arr = list(map(lambda str: int(str), start_time.split(":")))
            settings.notifications_start_time = datetime.time(start_time_arr[0], start_time_arr[1])
            end_time_arr = list(map(lambda str: int(str), end_time.split(":")))
            settings.notifications_end_time = datetime.time(end_time_arr[0], end_time_arr[1])
            settings.notifications_interval = interval
            settings.timezone = timezone
            settings.save()

        except UserSettings.DoesNotExist:
            settings = UserSettings.objects.create( notifications_start_time = start_time, \
                notifications_end_time = end_time, \
                notifications_interval = interval, \
                timezone = timezone, \
                user = user)
        ok = True
        return UpsertUserSettings(userSettings=settings, ok=ok)


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

        if permission_given and (not endpoint or not p256dh or not auth):
            raise GraphQLError('Malformed request, all subscription fields are mandatory')

        try:
            subscription = PushSubscription.objects.get(user = info.context.user)
            subscription.endpoint = endpoint
            subscription.p256dh = p256dh
            subscription.auth = auth
            subscription.save()
        except PushSubscription.DoesNotExist:
            subscription = PushSubscription.objects.create(endpoint=endpoint, p256dh=p256dh, auth=auth, permission_given=permission_given, user=info.context.user)
        ok = True
        return CreateSubscription(subscription=subscription, ok=ok)

class UserSettingQuery(graphene.ObjectType):
    user_settings = graphene.Field(lambda: UserSettingsType)

    def resolve_user_settings(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('Unauthorized')

        try:
            settings = UserSettings.objects.get(user = user)

        except UserSettings.DoesNotExist:
            settings = UserSettings(user = user)
            settings.save()

        return settings

class SharingWithQuery(graphene.ObjectType):
    sharing_with = graphene.List(lambda: SharedWithType)

    def resolve_sharing_with(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('Unauthorized')

        shared_with = SharedWith.objects.filter(owner = user)
        return shared_with


class ShareWithNewUser(graphene.Mutation):
    class Arguments:
        email = graphene.String()

    ok = graphene.Boolean()
    shared_with = graphene.Field(SharedWithType)

    @classmethod
    def mutate(root, id, info, email):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')

        try:
            borrower = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise GraphQLError('Borrower with provided email doesn\'t exist')

        shared_with_entry = SharedWith.objects.filter(owner=info.context.user, borrower=borrower)
        if len(shared_with_entry) > 0:
            raise GraphQLError('Already shared with the provided user')
        new_shared_with = SharedWith.objects.create(owner=info.context.user, borrower=borrower)
        ok = True
        return ShareWithNewUser(shared_with=new_shared_with, ok=ok)

class DeleteSharedWith(graphene.Mutation):
    class Arguments:
        email = graphene.String()
    ok = graphene.Boolean()
    shared_with = graphene.Field(SharedWithType)

    @classmethod
    def mutate(root, id, info, email):
        if not info.context.user.is_authenticated:
            raise GraphQLError('Unauthorized')
        try:
            borrower = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise GraphQLError('Borrower with provided email doesn\'t exist')

        try:
            shared_with_entry = SharedWith.objects.get(owner=info.context.user, borrower=borrower)
        except SharedWith.DoesNotExist:
            raise GraphQLError('There is no shared rights between provided 2 users')

        shared_with_entry.delete()
        ok = True
        return DeleteSharedWith(shared_with=shared_with_entry, ok=ok)

class SubscriptionQuery(graphene.ObjectType):
    subscription = graphene.Boolean()

    def resolve_subscription(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError('Unauthorized')

        try:
            subscription = PushSubscription.objects.get(user = user)
            if subscription:
                    return subscription.permission_given and subscription.endpoint
        except PushSubscription.DoesNotExist:
            return False
        return False


class Query(UserQuery, MeQuery, SubscriptionQuery, UserSettingQuery, SharingWithQuery, graphene.ObjectType):
    pass

class Mutation(AuthMutation, graphene.ObjectType):
    create_subscription = CreateSubscription.Field()
    upsert_user_settings = UpsertUserSettings.Field()
    delete_shared_with = DeleteSharedWith.Field()
    share_with_new_user = ShareWithNewUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
