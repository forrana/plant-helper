# Generated by Django 3.2 on 2021-09-16 20:20

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('plants', '0013_plant_postpone_days'),
    ]

    operations = [
        migrations.CreateModel(
            name='WateredAtEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('watered_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('plant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plants.plant')),
            ],
        ),
    ]