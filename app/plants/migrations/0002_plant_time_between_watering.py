# Generated by Django 3.2 on 2021-04-29 20:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='plant',
            name='time_between_watering',
            field=models.DurationField(default=datetime.timedelta(days=7)),
        ),
    ]
