# Generated by Django 3.1.6 on 2021-03-21 20:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('labels', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='label',
            options={'ordering': ['-name']},
        ),
    ]
