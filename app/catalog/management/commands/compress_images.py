from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Compress all static images'

    def handle(self, *args, **kwargs):
        call_command('compress', verbosity=1)
        self.stdout.write(self.style.SUCCESS('Successfully compressed static files')) 