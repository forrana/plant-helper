# Generated by Django 3.2 on 2021-09-15 20:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0012_alter_plant_symbol'),
    ]

    operations = [
        migrations.AddField(
            model_name='plant',
            name='postpone_days',
            field=models.DurationField(default=datetime.timedelta(0)),
        ),
    ]
