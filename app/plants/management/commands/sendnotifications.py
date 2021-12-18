from django.core.management.base import BaseCommand, CommandError
from django.db.models import DateTimeField, ExpressionWrapper, F
from django.utils import timezone
from plants.utils import get_time_between_watering_field_for_current_season
from plants.models import Plant
from users.models import PushSubscription, UserSettings
from ._pushutils import send_to_subscription
from datetime import date, datetime
import pytz

class Command(BaseCommand):
    help = 'Send notifications to users with plants which need to be watered today'
    def handle(self, *args, **options):
        unwatered_plants = Plant.objects \
            .annotate(when_to_water=ExpressionWrapper( \
                (F('watered') + F(get_time_between_watering_field_for_current_season(timezone.now())) + F('postpone_days')), output_field=DateTimeField())) \
            .filter(when_to_water__lte = timezone.now().replace(hour=23, minute=59, second=59, microsecond=59)).order_by("owner").values_list('owner')
        owners_set = set()
        for owner in unwatered_plants:
            owners_set.add(owner)
        self.stdout.write(self.style.SUCCESS('owner set:  "%s"' % owners_set))
        for owner in owners_set:
            try:
                self.stdout.write(self.style.SUCCESS('trying to send notifications for user  "%s"' % owner))
                subscription = PushSubscription.objects.get(user = owner)
                settings = UserSettings.objects.get(user = owner)
                now = timezone.now()
                user_timezone = pytz.timezone(settings.timezone)
                user_start_time = settings.notifications_start_time
                user_end_time = settings.notifications_end_time
                user_start_notifications_date = datetime(now.year, now.month, now.day, user_start_time.hour, user_start_time.minute, now.second, now.microsecond, user_timezone)
                user_end_notifications_date = datetime(now.year, now.month, now.day, user_end_time.hour, user_end_time.minute, now.second, now.microsecond, user_timezone)
                if now >= user_start_notifications_date and now <= user_end_notifications_date:
                    self.stdout.write(self.style.SUCCESS('send notifications for user  "%s"' % owner))
                    payload = {"title": "Water me!", "message": "Some of your plants need to be watered!"}
                    send_to_subscription(subscription, payload)
            except PushSubscription.DoesNotExist:
                self.stdout.write(self.style.SUCCESS('subscriptoin for user does not exist  "%s"' % owner))
            except UserSettings.DoesNotExist:
                self.stdout.write(self.style.SUCCESS('UserSettings for user doesn not exist  "%s"' % owner))
