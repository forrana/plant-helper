# Generated by Django 3.2 on 2021-04-20 20:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='House',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('house_name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_name', models.CharField(max_length=200)),
                ('room_description', models.CharField(max_length=200)),
                ('house', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plants.house')),
            ],
        ),
        migrations.CreateModel(
            name='Plant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('scientific_name', models.CharField(max_length=200)),
                ('planted', models.DateTimeField(verbose_name='date planted')),
                ('watered', models.DateTimeField(verbose_name='date watered')),
                ('repoted', models.DateTimeField(verbose_name='date repoted')),
                ('furtilized', models.DateTimeField(verbose_name='date furtilized')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plants.room')),
            ],
        ),
    ]
