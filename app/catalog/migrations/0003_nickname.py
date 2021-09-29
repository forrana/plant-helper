# Generated by Django 3.2 on 2021-09-28 20:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0002_auto_20210918_1822'),
    ]

    operations = [
        migrations.CreateModel(
            name='NickName',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('plant_entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='catalog.plantentry')),
            ],
        ),
    ]
