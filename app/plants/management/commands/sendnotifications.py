from django.core.management.base import BaseCommand, CommandError
from django.db.models import DateTimeField, ExpressionWrapper, F
from django.utils import timezone
from plants.models import Plant
from users.models import PushSubscription
from ._pushutils import send_to_subscription

class Command(BaseCommand):
    help = 'Send notifications to users with plants which need to be watered today'
    def handle(self, *args, **options):
        unwatered_plants = Plant.objects \
            .annotate(when_to_water=ExpressionWrapper( \
                (F('watered') + F('time_between_watering')), output_field=DateTimeField())) \
            .filter(when_to_water__lte = timezone.now()).order_by("owner").values_list('owner')
        for owner in unwatered_plants:
            self.stdout.write(self.style.SUCCESS(owner))
            try:
                subscription = PushSubscription.objects.get(user = owner)
                payload = {"title": "Water me!", "message": "Some of your plants need to be watered!"}
                send_to_subscription(subscription, payload)
                self.stdout.write(self.style.SUCCESS('subscriptoin -  "%s"' % subscription.auth))
            except PushSubscription.DoesNotExist:
                self.stdout.write(self.style.SUCCESS('subscriptoin for user not exist  "%s"' % owner))