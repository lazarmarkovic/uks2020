# Generated by Django 3.1.6 on 2021-03-21 20:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labels', '0002_auto_20210321_2144'),
        ('issues', '0003_auto_20210309_1049'),
    ]

    operations = [
        migrations.AddField(
            model_name='issue',
            name='labels',
            field=models.ManyToManyField(blank=True, to='labels.Label'),
        ),
    ]