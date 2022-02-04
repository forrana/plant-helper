from locale import currency
from django.test import TestCase
import datetime


from users.models import UserSettings
from .sendnotifications import is_time_to_send_notification
from django.utils import timezone

class NotificationsLogicTestCase(TestCase):
    def test_notifications_are_sent_when_time_is_less_then_end(self):
        """Server time is 15:59(UTC), end time is 18:00(+2)"""
        current_interval = "15"
        settings = UserSettings(
            notifications_start_time = datetime.time(8, 0),
            notifications_end_time = datetime.time(18, 0),
            notifications_interval = current_interval,
            timezone = "Europe/Helsinki"
        )
        now = timezone.now().replace(hour=15, minute=59, second=59, microsecond=59)
        self.assertEqual(is_time_to_send_notification(now, current_interval, settings), True)

    def test_notifications_are_sent_when_time_is_equal(self):
        """Server time is 6:00(UTC), start time is 8:00(+2)"""
        current_interval = "15"
        settings = UserSettings(
            notifications_start_time = datetime.time(6, 0),
            notifications_end_time = datetime.time(18, 0),
            notifications_interval = current_interval,
            timezone = "Europe/Helsinki"
        )
        now = timezone.now().replace(hour=8, minute=00, second=00, microsecond=00)
        self.assertEqual(is_time_to_send_notification(now, current_interval, settings), True)

    def test_notifications_are_not_sent_when_time_is_less_then_start(self):
        """Server time is 5:59(UTC), start time is 8:00(+2)"""
        current_interval = "15"
        settings = UserSettings(
            notifications_start_time = datetime.time(8, 0),
            notifications_end_time = datetime.time(18, 0),
            notifications_interval = current_interval,
            timezone = "Europe/Helsinki"
        )
        now = timezone.now().replace(hour=5, minute=59, second=59, microsecond=59)
        self.assertEqual(is_time_to_send_notification(now, current_interval, settings), False)

    def test_notifications_are_not_sent_when_time_is_more(self):
        """Server time is 16:00:01(UTC), start time is 18:00(+2)"""
        current_interval = "15"
        settings = UserSettings(
            notifications_start_time = datetime.time(8, 0),
            notifications_end_time = datetime.time(18, 0),
            notifications_interval = current_interval,
            timezone = "Europe/Helsinki"
        )
        now = timezone.now().replace(hour=16, minute=0, second=1, microsecond=1)
        self.assertEqual(is_time_to_send_notification(now, current_interval, settings), False)

    def test_notifications_are_sent_when_time_is_equal_in_the_summer(self):
        """Server time is 6:00(UTC), start time is 8:00(+2)"""
        current_interval = "15"
        settings = UserSettings(
            notifications_start_time = datetime.time(6, 0),
            notifications_end_time = datetime.time(18, 0),
            notifications_interval = current_interval,
            timezone = "Europe/Helsinki"
        )
        now = timezone.now().replace(hour=8, minute=00, second=00, microsecond=00, month=6)
        self.assertEqual(is_time_to_send_notification(now, current_interval, settings), True)

    def test_notifications_are_sent_when_time_is_equal_in_the_winter(self):
        """Server time is 6:00(UTC), start time is 8:00(+2)"""
        current_interval = "15"
        settings = UserSettings(
            notifications_start_time = datetime.time(6, 0),
            notifications_end_time = datetime.time(18, 0),
            notifications_interval = current_interval,
            timezone = "Europe/Helsinki"
        )
        now = timezone.now().replace(hour=8, minute=00, second=00, microsecond=00, month=1)
        self.assertEqual(is_time_to_send_notification(now, current_interval, settings), True)